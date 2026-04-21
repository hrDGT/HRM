'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  GetCvDocument,
  UpdateCvDocument,
  UpdateCvSkillsDocument,
  UpsertCvProjectDocument,
  DeleteCvProjectDocument,
  type GetCvQuery,
  type UpdateCvMutation,
  type UpdateCvMutationVariables,
  type UpdateCvSkillsMutation,
  type UpdateCvSkillsMutationVariables,
  type UpsertCvProjectMutation,
  type UpsertCvProjectMutationVariables,
  type DeleteCvProjectMutation,
  type DeleteCvProjectMutationVariables,
} from '@/generated/graphql';
import { print } from 'graphql';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { Button } from '@/components/ui/button';
import { LabeledInput, LabeledTextarea } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ChevronRight, Search, Plus, EllipsisVertical, X, Trash2, Download } from 'lucide-react';
import Link from 'next/link';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import { cvDetailsSchema, type CVDetailsFormData } from '@/lib/schemas/cv';
import { projectSchema, type ProjectFormData } from '@/lib/schemas/project';

const GRAPHQL_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL || '/api/graphql';

type TabType = 'details' | 'skills' | 'projects' | 'preview';

interface Skill {
  id: string;
  name: string;
  categoryId?: string | null;
  categoryName?: string | null;
  mastery?: string;
}

interface Project {
  id: string;
  name: string;
  domain: string;
  startDate: string;
  endDate: string | null;
  description: string;
  bulletPoints: string[];
  environment?: string[];
  cvProjectId?: string;
}

export default function EditCVPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [cv, setCV] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('details');
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkillIds, setSelectedSkillIds] = useState<Set<string>>(new Set());
  const [isAddSkillModalOpen, setIsAddSkillModalOpen] = useState(false);
  const [skillsSaving, setSkillsSaving] = useState(false);

  const [projects, setProjects] = useState<Project[]>([]);
  const [projectSearchQuery, setProjectSearchQuery] = useState('');
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectMenuOpenId, setProjectMenuOpenId] = useState<string | null>(null);
  const [deleteProjectModal, setDeleteProjectModal] = useState<{
    isOpen: boolean;
    projectId: string | null;
    projectName: string;
  }>({ isOpen: false, projectId: null, projectName: '' });
  const [projectsSaving, setProjectsSaving] = useState(false);

  const [userRole, setUserRole] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CVDetailsFormData>({
    resolver: zodResolver(cvDetailsSchema),
  });

  const projectForm = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      domain: '',
      startDate: '',
      endDate: '',
      description: '',
      bulletPoints: '',
      environment: '',
    },
  });

  const getCookie = (name: string): string | null => {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null;
    }
    return null;
  };

  const executeGraphQL = async <TData, TVariables>(
    document: TypedDocumentNode<TData, TVariables> | string,
    variables?: TVariables
  ): Promise<TData> => {
    const query = typeof document === 'string' ? document : print(document);
    const response = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
      credentials: 'include',
    });
    const result = await response.json();
    if (!response.ok) {
      if (response.status === 401) throw new Error('Unauthorized');
      if (response.status === 403) throw new Error('Forbidden');
    }
    if (result.errors) throw new Error(result.errors[0].message);
    return result.data;
  };

  useEffect(() => {
    const role = getCookie('user_role');
    const email = getCookie('user_email');
    const uid = getCookie('user_id');
    setUserRole(role);
    setUserEmail(email);
    setUserId(uid);

    const token = getCookie('auth_token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const data = await executeGraphQL<GetCvQuery, { id: string }>(GetCvDocument, { id });
        if (data.cv) {
          setCV(data.cv);
          reset({
            fullname: data.cv.fullname,
            education: data.cv.education || '',
            description: data.cv.description || '',
          });
          setSkills(data.cv.skills || []);
          const projs: Project[] = (data.cv.projects || []).map((p: any) => ({
            id: p.project.id,
            cvProjectId: p.id,
            name: p.project.name,
            domain: p.project.domain,
            startDate: p.startDate,
            endDate: p.endDate,
            description: p.project.description,
            bulletPoints: p.responsibilities || [],
            environment: p.project.environment || [],
          }));
          setProjects(projs);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        if (err instanceof Error && (err.message.includes('Unauthorized') || err.message.includes('Forbidden'))) {
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, reset, router]);

  const canEdit = cv ? userRole === 'admin' || cv.userId === userId : false;

  const onDetailsSubmit = async (data: CVDetailsFormData) => {
    if (!canEdit) return;
    setIsSaving(true);
    try {
      await executeGraphQL<UpdateCvMutation, UpdateCvMutationVariables>(UpdateCvDocument, {
        input: { id, ...data, email: cv.email },
      });
      router.push('/cvs');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setIsSaving(false);
    }
  };

  const saveSkills = async (newSkills: Skill[]) => {
    if (!canEdit) return;
    setSkillsSaving(true);
    try {
      await executeGraphQL<UpdateCvSkillsMutation, UpdateCvSkillsMutationVariables>(
        UpdateCvSkillsDocument,
        { id, skills: newSkills.map(s => ({ name: s.name, categoryId: s.categoryId, mastery: s.mastery })) }
      );
    } catch (err) {
      alert('Failed to save skills');
    } finally {
      setSkillsSaving(false);
    }
  };

  const addSkill = (skill: Omit<Skill, 'id'>) => {
    const newSkill = { ...skill, id: Date.now().toString() };
    const updated = [...skills, newSkill];
    setSkills(updated);
    saveSkills(updated);
    setIsAddSkillModalOpen(false);
  };

  const removeSelectedSkills = () => {
    const updated = skills.filter(s => !selectedSkillIds.has(s.id));
    setSkills(updated);
    setSelectedSkillIds(new Set());
    saveSkills(updated);
  };

  const toggleSkillSelection = (id: string) => {
    if (!canEdit) return;
    setSelectedSkillIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const saveProject = async (projectData: ProjectFormData, cvProjectId?: string) => {
    if (!canEdit) return;
    setProjectsSaving(true);
    try {
      const bulletPoints = projectData.bulletPoints
        ? projectData.bulletPoints.split('\n').filter(l => l.trim())
        : [];
      const environment = projectData.environment
        ? projectData.environment.split(',').map(s => s.trim())
        : [];
      const input = {
        id: editingProject?.id,
        name: projectData.name,
        domain: projectData.domain,
        startDate: projectData.startDate,
        endDate: projectData.endDate || null,
        description: projectData.description,
        responsibilities: bulletPoints,
        environment,
      };
      const result = await executeGraphQL<UpsertCvProjectMutation, UpsertCvProjectMutationVariables>(
        UpsertCvProjectDocument,
        { cvId: id, project: input }
      );
      const upserted = result.upsertCvProject;
      const newProject: Project = {
        id: upserted.project.id,
        cvProjectId: upserted.id,
        name: upserted.project.name,
        domain: upserted.project.domain,
        startDate: upserted.startDate,
        endDate: upserted.endDate,
        description: projectData.description,
        bulletPoints: upserted.responsibilities,
        environment: environment,
      };
      if (editingProject) {
        setProjects(prev => prev.map(p => p.cvProjectId === cvProjectId ? newProject : p));
      } else {
        setProjects(prev => [...prev, newProject]);
      }
      setIsProjectModalOpen(false);
    } catch (err) {
      alert('Failed to save project');
    } finally {
      setProjectsSaving(false);
    }
  };

  const deleteProject = async (cvProjectId: string) => {
    if (!canEdit) return;
    try {
      await executeGraphQL<DeleteCvProjectMutation, DeleteCvProjectMutationVariables>(
        DeleteCvProjectDocument,
        { cvId: id, cvProjectId }
      );
      setProjects(prev => prev.filter(p => p.cvProjectId !== cvProjectId));
      setDeleteProjectModal({ isOpen: false, projectId: null, projectName: '' });
    } catch (err) {
      alert('Failed to delete project');
    }
  };

  const exportToPDF = async () => {
    if (!previewRef.current) return;
    setIsExporting(true);
    try {
      setActiveTab('preview');
      await new Promise(resolve => setTimeout(resolve, 150));
      const dataUrl = await toPng(previewRef.current, { backgroundColor: '#2d2d2d', pixelRatio: 2 });
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const img = new Image();
      img.src = dataUrl;
      await new Promise(resolve => { img.onload = resolve; });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (img.height * pdfWidth) / img.width;
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${cv.fullname.replace(/\s+/g, '_')}_CV.pdf`);
    } catch (error) {
      alert('PDF export failed');
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64">Loading...</div>;
  if (!cv) return <div className="container mx-auto p-6">CV not found</div>;

  const tabs = [
    { id: 'details', label: 'DETAILS' },
    { id: 'skills', label: 'SKILLS' },
    { id: 'projects', label: 'PROJECTS' },
    { id: 'preview', label: 'PREVIEW' },
  ];

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-6 max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-sm text-neutral-400">
            <Link href="/cvs" className="hover:text-white">CVs</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white">{cv.title}</span>
          </div>
          <Button onClick={exportToPDF} disabled={isExporting} className="bg-red-500 hover:bg-red-700 text-white gap-2">
            <Download className="h-4 w-4" />
            {isExporting ? 'EXPORTING...' : 'EXPORT'}
          </Button>
        </div>

        <div className="border-b border-white/10 mb-8">
          <div className="flex gap-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`pb-3 px-1 text-sm font-medium transition-colors relative ${activeTab === tab.id ? 'text-red-500' : 'text-neutral-400 hover:text-white'}`}
              >
                {tab.label}
                {activeTab === tab.id && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500" />}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'details' && (
          <form onSubmit={handleSubmit(onDetailsSubmit)} className="space-y-6">
            <LabeledInput label="Name" {...register('fullname')} disabled={!canEdit} />
            <LabeledInput label="Education" {...register('education')} disabled={!canEdit} />
            <LabeledTextarea label="Description" rows={6} {...register('description')} disabled={!canEdit} />
            {canEdit && (
              <div className="flex justify-end">
                <Button type="submit" disabled={isSaving} className="bg-red-500 hover:bg-red-600 text-white px-8">
                  {isSaving ? 'UPDATING...' : 'UPDATE'}
                </Button>
              </div>
            )}
          </form>
        )}

        {activeTab === 'skills' && (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-3">
              {skills.map(skill => (
                <div
                  key={skill.id}
                  onClick={() => toggleSkillSelection(skill.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md ${canEdit ? 'cursor-pointer hover:bg-white/5' : ''} ${selectedSkillIds.has(skill.id) ? 'bg-white/5 ring-1 ring-white/20' : ''}`}
                >
                  <span className="text-white">{skill.name}</span>
                  {skill.mastery && <span className="text-xs text-neutral-400">({skill.mastery})</span>}
                </div>
              ))}
            </div>
            {canEdit && (
              <div className="flex gap-3 pt-6 border-t border-white/10">
                <Button onClick={() => setIsAddSkillModalOpen(true)}>ADD SKILL</Button>
                <Button onClick={removeSelectedSkills} disabled={selectedSkillIds.size === 0} variant="outline" className="text-red-500">
                  <Trash2 className="mr-1 h-4 w-4" /> REMOVE
                </Button>
                {skillsSaving && <span className="text-neutral-400">Saving...</span>}
              </div>
            )}
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-300" />
                <input
                  placeholder="Search"
                  value={projectSearchQuery}
                  onChange={e => setProjectSearchQuery(e.target.value)}
                  className="pl-9 w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-white"
                />
              </div>
              {canEdit && (
                <Button onClick={() => { setEditingProject(null); projectForm.reset(); setIsProjectModalOpen(true); }} className="bg-red-500 hover:bg-red-600">
                  <Plus className="h-4 w-4 mr-2" /> ADD PROJECT
                </Button>
              )}
            </div>
            <div className="divide-y divide-white/10">
              {projects.filter(p => p.name.toLowerCase().includes(projectSearchQuery.toLowerCase())).map(project => (
                <div key={project.cvProjectId} className="py-6 px-4 hover:bg-white/2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-white">{project.name}</h3>
                      <p className="text-sm text-neutral-400">{project.domain}</p>
                      <p className="text-xs text-neutral-500">{project.startDate} – {project.endDate || 'Present'}</p>
                    </div>
                    {canEdit && (
                      <div className="relative">
                        <Button variant="ghost" size="icon" onClick={() => setProjectMenuOpenId(projectMenuOpenId === project.cvProjectId ? null : project.cvProjectId!)}>
                          <EllipsisVertical className="h-4 w-4" />
                        </Button>
                        {projectMenuOpenId === project.cvProjectId && (
                          <div className="absolute right-0 top-8 z-50 bg-neutral-800 rounded-md shadow-lg border border-white/10 py-1">
                            <button onClick={() => { setEditingProject(project);
    projectForm.reset({
      name: project.name,
      domain: project.domain,
      startDate: project.startDate,
      endDate: project.endDate ?? undefined,   
      description: project.description,
      bulletPoints: project.bulletPoints.join('\n'),
      environment: project.environment?.join(', ') ?? '',
    });; setIsProjectModalOpen(true); setProjectMenuOpenId(null); }} className="w-full text-left px-4 py-2 text-sm hover:bg-white/10">Edit</button>
                            <button onClick={() => { setDeleteProjectModal({ isOpen: true, projectId: project.cvProjectId!, projectName: project.name }); setProjectMenuOpenId(null); }} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/10">Delete</button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <p className="text-neutral-300 mt-3">{project.description}</p>
                  <ul className="list-disc list-inside text-sm text-neutral-400 mt-2">
                    {project.bulletPoints.map((point, i) => <li key={i}>{point}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'preview' && (
          <div ref={previewRef} className="p-8 rounded-lg bg-neutral-700 text-white">
            <h1 className="text-4xl font-bold">{cv.fullname}</h1>
            <p className="text-lg mt-2">{cv.title}</p>
            <div className="grid grid-cols-3 gap-8 mt-8">
              <div><h3 className="font-semibold uppercase text-sm">Education</h3><p>{cv.education}</p></div>
              <div><h3 className="font-semibold uppercase text-sm">Skills</h3><p>{skills.map(s => s.name).join(', ')}</p></div>
              <div><h3 className="font-semibold uppercase text-sm">Projects</h3>{projects.map(p => <p key={p.cvProjectId}>{p.name}</p>)}</div>
            </div>
            <p className="mt-6">{cv.description}</p>
          </div>
        )}
      </div>

      {isAddSkillModalOpen && (
        <AddSkillModal onClose={() => setIsAddSkillModalOpen(false)} onAdd={addSkill} />
      )}

      <Dialog open={isProjectModalOpen} onOpenChange={setIsProjectModalOpen}>
        <DialogContent className="sm:max-w-xl bg-neutral-700 text-white">
          <DialogHeader><DialogTitle>{editingProject ? 'Edit Project' : 'Add Project'}</DialogTitle></DialogHeader>
          <form onSubmit={projectForm.handleSubmit(data => saveProject(data, editingProject?.cvProjectId))} className="space-y-4">
            <LabeledInput label="Project Name" {...projectForm.register('name')} />
            <LabeledInput label="Domain" {...projectForm.register('domain')} />
            <div className="grid grid-cols-2 gap-4">
              <LabeledInput label="Start Date" placeholder="YYYY-MM-DD" {...projectForm.register('startDate')} />
              <LabeledInput label="End Date" placeholder="YYYY-MM-DD" {...projectForm.register('endDate')} />
            </div>
            <LabeledTextarea label="Description" rows={4} {...projectForm.register('description')} />
            <LabeledInput label="Environment (comma separated)" {...projectForm.register('environment')} />
            <LabeledTextarea label="Responsibilities (one per line)" rows={4} {...projectForm.register('bulletPoints')} />
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setIsProjectModalOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-red-500 hover:bg-red-600">Save</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {deleteProjectModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-neutral-800 p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-semibold text-white">Delete Project</h2>
            <p className="text-neutral-300 my-4">Are you sure you want to delete "{deleteProjectModal.projectName}"?</p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDeleteProjectModal({ isOpen: false, projectId: null, projectName: '' })}>Cancel</Button>
              <Button variant="destructive" onClick={() => deleteProject(deleteProjectModal.projectId!)}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AddSkillModal({ onClose, onAdd }: { onClose: () => void; onAdd: (skill: Omit<Skill, 'id'>) => void }) {
  const [name, setName] = useState('');
  const [mastery, setMastery] = useState('Proficient');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({ name: name.trim(), mastery });
    onClose();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-neutral-800 p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold text-white mb-4">Add Skill</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <LabeledInput label="Skill Name" value={name} onChange={e => setName(e.target.value)} />
          <div>
            <Label className="text-white">Mastery</Label>
            <select value={mastery} onChange={e => setMastery(e.target.value)} className="w-full mt-1 bg-neutral-700 border border-neutral-600 rounded-md px-3 py-2 text-white">
              <option>Novice</option>
              <option>Competent</option>
              <option>Proficient</option>
              <option>Expert</option>
            </select>
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="bg-red-500 hover:bg-red-600">Add</Button>
          </div>
        </form>
      </div>
    </div>
  );
}