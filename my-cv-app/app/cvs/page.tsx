'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useCVStore } from '../store/useCVStore';
import {
  GetCVsDocument,
  CreateCvDocument,
  UpdateCvDocument,
  DeleteCvDocument,
  type GetCVsQuery,
  type CreateCvMutation,
  type UpdateCvMutation,
  type DeleteCvMutation,
  type CreateCvMutationVariables,
  type UpdateCvMutationVariables,
  type DeleteCvMutationVariables,
} from '@/generated/graphql';
import { print } from 'graphql';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { Button } from '@/components/ui/button';
import { Input, LabeledInput, LabeledTextarea } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Search, Plus, EllipsisVertical, X } from 'lucide-react';
import { cvListSchema, type CVListFormData } from '@/lib/schemas/cv';

const GRAPHQL_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL || '/api/graphql';

export default function CVPage() {
  const { cvs, setCVs, addCV, removeCV, updateCV } = useCVStore();
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<'title' | 'description' | 'email'>('title');
  const [sortAsc, setSortAsc] = useState(true);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userFullname, setUserFullname] = useState<string | null>(null);

  const getCookie = (name: string): string | null => {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      const cookieValue = parts.pop()?.split(';').shift();
      return cookieValue || null;
    }
    return null;
  };

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    cvId: string | null;
    cvTitle: string;
  }>({ isOpen: false, cvId: null, cvTitle: '' });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CVListFormData>({
    resolver: zodResolver(cvListSchema),
    defaultValues: {
      title: '',
      fullname: '',
      email: '',
      education: '',
      description: '',
    },
  });

  const router = useRouter();

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
      if (response.status === 401) throw new Error('Unauthorized: Please log in');
      if (response.status === 403) throw new Error('Forbidden: Admin access required');
    }

    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      throw new Error(result.errors[0].message);
    }
    return result.data;
  };

  useEffect(() => {
    const token = getCookie('auth_token');
    const role = getCookie('user_role');
    const email = getCookie('user_email');
    const fullname = getCookie('user_fullname');

    if (!token) {
      router.push('/login');
      return;
    }

    setIsAdmin(role === 'admin');
    setUserEmail(email);
    setUserFullname(fullname);

    executeGraphQL<GetCVsQuery, {}>(GetCVsDocument)
      .then((data) => {
        setCVs(data.CVs);
      })
      .catch((err: unknown) => {
        console.error('Fetch error:', err);
        const message = err instanceof Error ? err.message : 'An unknown error occurred';
        if (message.includes('Unauthorized') || message.includes('Forbidden')) {
          router.push('/login');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [setCVs, router]);

  const onSubmit = async (data: CVListFormData) => {
    try {
      if (editingId) {
        const res = await executeGraphQL<UpdateCvMutation, UpdateCvMutationVariables>(
          UpdateCvDocument,
          { input: { ...data, id: editingId } }
        );
        if (res.updateCV) {
          updateCV(res.updateCV);
        }
      } else {
        const res = await executeGraphQL<CreateCvMutation, CreateCvMutationVariables>(
          CreateCvDocument,
          { input: data }
        );
        if (res.createCV) addCV(res.createCV);
      }
      reset();
      setEditingId(null);
      setDialogOpen(false);
    } catch (err: unknown) {
      console.error('Operation error:', err);
      const message = err instanceof Error ? err.message : 'An unknown error occurred';
      alert(message);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.cvId) return;
    try {
      const res = await executeGraphQL<DeleteCvMutation, DeleteCvMutationVariables>(
        DeleteCvDocument,
        { id: deleteModal.cvId }
      );
      if (res.deleteCV > 0) removeCV(deleteModal.cvId);
    } catch (err: unknown) {
      console.error('Operation error:', err);
      const message = err instanceof Error ? err.message : 'An unknown error occurred';
      alert(message);
    } finally {
      setDeleteModal({ isOpen: false, cvId: null, cvTitle: '' });
    }
  };

  const startEdit = (cv: CVListFormData & { id: string }) => {
    reset({
      title: cv.title,
      fullname: cv.fullname,
      email: cv.email,
      education: cv.education,
      description: cv.description,
    });
    setEditingId(cv.id);
    setDialogOpen(true);
  };

  const visibleCVs = isAdmin ? cvs : cvs.filter((cv: any) => cv.email === userEmail);

  const filteredCVs = visibleCVs
    .filter(
      (cv: any) =>
        cv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cv.education.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cv.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a: any, b: any) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const compare = aVal.localeCompare(bVal);
      return sortAsc ? compare : -compare;
    });

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading CVs...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="mb-4">
        <h1 className="text-2xl tracking-tight text-neutral-500">CVs</h1>
      </div>

      <div className="flex items-center justify-between mb-6 flex-nowrap w-full">
        <div className="relative flex-1 max-w-75">
          <Search className="absolute left-3 top-4 -translate-y-1/2 h-4 w-4 text-white" />
          <Input
            placeholder="Search"
            value={searchQuery}
            onChange={(e: any) => setSearchQuery(e.target.value)}
            className="pl-9 text-white rounded-xl"
          />
        </div>

        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            if (!open) {
              reset({
                title: '',
                fullname: userFullname || '',
                email: userEmail || '',
                education: '',
                description: '',
              });
              setEditingId(null);
            } else if (!editingId) {
              reset({
                title: '',
                fullname: userFullname || '',
                email: userEmail || '',
                education: '',
                description: '',
              });
            }
            setDialogOpen(open);
          }}
        >
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 text-red-500 hover:bg-transparent shrink-0 cursor-pointer">
              <Plus className="h-4 w-4" />
              <span>CREATE CV</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-125 bg-neutral-700 text-white">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit CV' : 'Create New CV'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
              <input type="hidden" {...register('fullname')} />
              <input type="hidden" {...register('email')} />

              <div>
                <LabeledInput id="title" label="Title" {...register('title')} />
                {errors.title && (
                  <p className="text-sm text-red-700 mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <LabeledInput id="education" label="Education" {...register('education')} />
                {errors.education && (
                  <p className="text-sm text-red-700 mt-1">{errors.education.message}</p>
                )}
              </div>

              <div>
                <LabeledTextarea
                  id="description"
                  label="Description"
                  rows={4}
                  {...register('description')}
                />
                {errors.description && (
                  <p className="text-sm text-red-700 mt-1">{errors.description.message}</p>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="grey" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="red" type="submit">
                  {editingId ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-[2fr_3fr_1.5fr_auto] gap-4 px-4 py-3 border-b border-white/10 text-md font-medium text-white">
        <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('title')}>
          Title {sortField === 'title' && (sortAsc ? '↑' : '↓')}
        </div>
        <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('description')}>
          Description {sortField === 'description' && (sortAsc ? '↑' : '↓')}
        </div>
        <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('email')}>
          Employee {sortField === 'email' && (sortAsc ? '↑' : '↓')}
        </div>
        <div className="w-8"></div>
      </div>

      <div className="divide-y divide-white/10">
        {filteredCVs.map((cv: any) => {
          const canEdit = isAdmin || cv.email === userEmail;
          const canDelete = isAdmin || cv.email === userEmail;

          return (
            <div key={cv.id} className="group py-6 px-4 hover:bg-white/2 transition-colors">
              <div className="grid grid-cols-[2fr_1.5fr_1.5fr_auto] gap-4 items-start mb-4">
                <h3 className="text-sm font-medium text-white">{cv.title}</h3>
                <p className="text-sm text-white">{cv.education}</p>
                <p className="text-sm text-white">{cv.email}</p>

                {(canEdit || canDelete) ? (
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 p-0"
                      onClick={() => setOpenMenuId(openMenuId === cv.id ? null : cv.id)}
                    >
                      <EllipsisVertical className="h-4 w-4 text-white" />
                    </Button>

                    {openMenuId === cv.id && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setOpenMenuId(null)}
                        />
                        <div className="absolute right-0 top-8 z-50 min-w-30 bg-neutral-800 rounded-md shadow-lg border border-white/10 py-1 text-white">
                          {canEdit && (
                            <button
                              onClick={() => {
                                startEdit(cv);
                                setOpenMenuId(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-white/10 transition-colors"
                            >
                              Edit
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => {
                                setDeleteModal({ isOpen: true, cvId: cv.id, cvTitle: cv.title });
                                setOpenMenuId(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/10 hover:text-red-300 transition-colors"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="w-8" />
                )}
              </div>

              <div className="max-w-4xl">
                <p className="text-sm leading-relaxed text-neutral-500">
                  {cv.description.length > 150
                    ? `${cv.description.slice(0, 150)}...`
                    : cv.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {deleteModal.isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setDeleteModal({ isOpen: false, cvId: null, cvTitle: '' })}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-neutral-700 rounded-lg shadow-xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold text-white">Delete CV</h2>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 p-0 text-neutral-400 hover:text-white"
                onClick={() => setDeleteModal({ isOpen: false, cvId: null, cvTitle: '' })}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-neutral-300 mb-6">
              Are you sure you want to delete CV "{deleteModal.cvTitle}"?
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="grey"
                onClick={() => setDeleteModal({ isOpen: false, cvId: null, cvTitle: '' })}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteConfirm}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Confirm
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}