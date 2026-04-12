'use client'

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCVStore } from './store/useCVStore';

// Explicitly use 'type' for interfaces to satisfy 'verbatimModuleSyntax'
import { 
  GetCVsDocument, 
  CreateCVDocument, 
  UpdateCVDocument, 
  DeleteCVDocument,
  type GetCVsQuery,
  type CreateCVMutation,
  type UpdateCVMutation,
  type DeleteCVMutation,
  type CreateCVMutationVariables,
  type UpdateCVMutationVariables,
  type DeleteCVMutationVariables,

} from './generated/graphql';

// Validation Schema
const cvSchema = z.object({
  title: z.string().min(1, "Title is required"),
  fullname: z.string().min(1, "Full name is required"),
  education: z.string().min(1, "Education is required"),
  description: z.string().min(1, "Description is required")
});

type CVFormData = z.infer<typeof cvSchema>;

function CVPage() {
  const { cvs, setCVs, addCV, removeCV, updateCV } = useCVStore();
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { register, handleSubmit, reset } = useForm<CVFormData>({
    resolver: zodResolver(cvSchema)
  });

  // 1. Core Fetcher (Native Fetch)
  const executeGraphQL = async <TData, TVariables>(
    document: any,
    variables?: TVariables
  ): Promise<TData> => {
    // Note: We extract the raw query string from the Document AST
    const query = document.loc?.source.body;
    
    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
    });

    const result = await response.json();
    if (result.errors) throw new Error(result.errors[0].message);
    return result.data;
  };

  // 2. Load CVs on mount
  useEffect(() => {
    executeGraphQL<GetCVsQuery, {}>(GetCVsDocument)
      .then(data => {
        if (data.CVs) setCVs(data.CVs);
      })
      .catch(err => console.error("Fetch error:", err))
      .finally(() => setLoading(false));
  }, [setCVs]);

  // 3. Create or Update Handler
  const onSubmit = async (data: CVFormData) => {
    try {
      if (editingId) {
        // Update Logic
        const res = await executeGraphQL<UpdateCVMutation, UpdateCVMutationVariables>(
          UpdateCVDocument, 
          { input: { ...data, id: editingId } }
        );
        if (res.updateCV) {
          updateCV(res.updateCV);
          setEditingId(null);
        }
      } else {
        // Create Logic
        const res = await executeGraphQL<CreateCVMutation, CreateCVMutationVariables>(
          CreateCVDocument, 
          { input: data }
        );
        if (res.createCV) addCV(res.createCV);
      }
      reset();
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  // 4. Delete Handler
  const onDelete = async (id: string) => {
    try {
      const res = await executeGraphQL<DeleteCVMutation, DeleteCVMutationVariables>(
        DeleteCVDocument, 
        { id }
      );
      if (res.deleteCV > 0) removeCV(id);
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // 5. Setup Edit Mode
  /* const startEdit = (cv: CV) => {
    setEditingId(cv.id);
    setValue('title', cv.title);
    setValue('fullname', cv.fullname);
    setValue('education', cv.education);
    setValue('description', cv.description);
  }; */

if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-lg text-neutral-500 self-start mb-4">CVs</h1>

      {/* This uses 'handleSubmit', 'register', and 'onCreate' */}
      <form onSubmit={handleSubmit(onSubmit)} className="mb-8 space-y-2">
        <input {...register('title')} placeholder="Title" className="border p-1 block w-full" />
        <input {...register('fullname')} placeholder="Full Name" className="border p-1 block w-full" />
        <input {...register('education')} placeholder="Education" className="border p-1 block w-full" />
        <textarea {...register('description')} placeholder="Description" className="border p-1 block w-full" />
        <button type="submit" className="bg-green-500 text-white px-4 py-2">Create CV</button>
      </form>

      {/* This uses 'cvs' and 'onDelete' */}
      <div className="space-y-4">
        {cvs.map((cv) => (
          <div key={cv.id} className="border p-4 flex justify-between">
            <div>
              <h2 className="font-bold">{cv.title}</h2>
              <p>{cv.fullname}</p>
            </div>
            <button 
              onClick={() => onDelete(cv.id)} 
              className="bg-red-500 text-white px-2 py-1 h-fit"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CVPage;