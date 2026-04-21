import { resolvers } from '../../app/api/graphql/resolvers';
import { pool } from '../../app/api/graphql/db';
import { checkAuth } from '../../app/api/graphql/auth';

jest.mock('@/app/api/graphql/db');
jest.mock('@/app/api/graphql/auth');

const mockPool = pool as jest.Mocked<typeof pool>;
const mockCheckAuth = checkAuth as jest.MockedFunction<typeof checkAuth>;

describe('GraphQL Resolvers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Query.CVs', () => {
    it('should return a list of CVs with skills and languages parsed', async () => {
      const mockRows = [
        { id: '1', title: 'CV1', fullname: 'John Doe', education: 'BSc', description: '...', email: 'john@example.com', skills: '[{"name":"JS"}]', languages: '[{"name":"English"}]', userId: 1 },
        { id: '2', title: 'CV2', fullname: 'Jane Smith', education: 'MSc', description: '...', email: 'jane@example.com', skills: '[]', languages: '[]', userId: 2 },
      ];
      mockPool.query.mockResolvedValue({ rows: mockRows } as any);

      const result = await resolvers.Query.CVs();

      expect(mockPool.query).toHaveBeenCalledWith(expect.stringContaining('SELECT'));
      expect(result).toHaveLength(2);
      expect(result[0].skills).toEqual([{ name: 'JS' }]);
      expect(result[0].languages).toEqual([{ name: 'English' }]);
      expect(result[1].skills).toEqual([]);
    });

    it('should handle empty result', async () => {
      mockPool.query.mockResolvedValue({ rows: [] } as any);
      const result = await resolvers.Query.CVs();
      expect(result).toEqual([]);
    });
  });

  describe('Query.cv', () => {
    it('should return a single CV with projects', async () => {
      const cvRow = { id: '1', title: 'CV1', fullname: 'John Doe', education: 'BSc', description: '...', email: 'john@example.com', skills: '[]', languages: '[]', userId: 1 };
      const projectRows = [
        { id: 'p1', startDate: '2020-01-01', endDate: '2020-12-31', responsibilities: ['dev'], project_id: 'proj1', project_name: 'Project X', domain: 'Web', project_description: 'Desc', environment: ['Node'] },
      ];
      mockPool.query
        .mockResolvedValueOnce({ rows: [cvRow] } as any)
        .mockResolvedValueOnce({ rows: projectRows } as any);

      const result = await resolvers.Query.cv(null, { id: '1' });

      expect(result.id).toBe('1');
      expect(result.projects).toHaveLength(1);
      expect(result.projects[0].project.name).toBe('Project X');
      expect(result.projects[0].responsibilities).toEqual(['dev']);
    });

    it('should return null if CV not found', async () => {
      mockPool.query.mockResolvedValue({ rows: [] } as any);
      const result = await resolvers.Query.cv(null, { id: '999' });
      expect(result).toBeNull();
    });
  });

  describe('Mutation.createCV', () => {
    const cvInput = { title: 'New CV', fullname: 'New User', education: 'BSc', description: 'Desc', email: 'new@example.com' };

    it('should create a CV when authenticated', async () => {
      mockCheckAuth.mockResolvedValue({ isAuthenticated: true, isAdmin: false, userId: 123 });
      mockPool.query
        .mockResolvedValueOnce({ rows: [{ id: 'new-id', name: 'New User', education: 'BSc', description: 'Desc' }] } as any)
        .mockResolvedValueOnce({ rows: [{ email: 'new@example.com' }] } as any);

      const result = await resolvers.Mutation.createCV(null, { cv: cvInput });

      expect(mockCheckAuth).toHaveBeenCalled();
      expect(mockPool.query).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO cv'), expect.any(Array));
      expect(result.title).toBe('New CV');
      expect(result.fullname).toBe('New User');
    });

    it('should throw Unauthorized if not authenticated', async () => {
      mockCheckAuth.mockResolvedValue({ isAuthenticated: false, isAdmin: false, userId: null });
      await expect(resolvers.Mutation.createCV(null, { cv: cvInput })).rejects.toThrow('Unauthorized');
    });
  });

  describe('Mutation.updateCV', () => {
    const updateInput = { id: 'cv1', title: 'Updated', fullname: 'Updated Name', education: 'PhD' };

    it('should allow admin to update any CV', async () => {
      mockCheckAuth.mockResolvedValue({ isAuthenticated: true, isAdmin: true, userId: 1 });
      mockPool.query
        .mockResolvedValueOnce({ rows: [{ userId: 2 }] } as any) 
        .mockResolvedValueOnce({ rows: [{ id: 'cv1', name: 'Updated Name', education: 'PhD', description: '...', skills: [], languages: [] }] } as any)
        .mockResolvedValueOnce({ rows: [{ email: 'owner@example.com' }] } as any);

      const result = await resolvers.Mutation.updateCV(null, { cv: updateInput });

      expect(result.fullname).toBe('Updated Name');
    });

    it('should allow owner to update their own CV', async () => {
      mockCheckAuth.mockResolvedValue({ isAuthenticated: true, isAdmin: false, userId: 2 });
      mockPool.query
        .mockResolvedValueOnce({ rows: [{ userId: 2 }] } as any)
        .mockResolvedValueOnce({ rows: [{ id: 'cv1', name: 'Updated Name', education: 'PhD', description: '...', skills: [], languages: [] }] } as any)
        .mockResolvedValueOnce({ rows: [{ email: 'owner@example.com' }] } as any);

      const result = await resolvers.Mutation.updateCV(null, { cv: updateInput });
      expect(result).toBeDefined();
    });

    it('should throw Forbidden if non-admin non-owner tries to update', async () => {
      mockCheckAuth.mockResolvedValue({ isAuthenticated: true, isAdmin: false, userId: 99 });
      mockPool.query.mockResolvedValueOnce({ rows: [{ userId: 2 }] } as any);

      await expect(resolvers.Mutation.updateCV(null, { cv: updateInput })).rejects.toThrow('Forbidden');
    });

    it('should throw error if no fields to update', async () => {
      mockCheckAuth.mockResolvedValue({ isAuthenticated: true, isAdmin: true, userId: 1 });
      mockPool.query.mockResolvedValueOnce({ rows: [{ userId: 2 }] } as any);

      await expect(resolvers.Mutation.updateCV(null, { cv: { id: 'cv1', email: 'x' } })).rejects.toThrow('No fields to update');
    });
  });

  describe('Mutation.deleteCV', () => {
    it('should delete CV when admin', async () => {
      mockCheckAuth.mockResolvedValue({ isAuthenticated: true, isAdmin: true, userId: 1 });
      mockPool.query
        .mockResolvedValueOnce({ rows: [{ userId: 2 }] } as any)
        .mockResolvedValueOnce({ rowCount: 1 } as any);

      const result = await resolvers.Mutation.deleteCV(null, { id: 'cv1' });
      expect(result).toBe(1);
    });

    it('should throw Forbidden if non-admin non-owner', async () => {
      mockCheckAuth.mockResolvedValue({ isAuthenticated: true, isAdmin: false, userId: 99 });
      mockPool.query.mockResolvedValueOnce({ rows: [{ userId: 2 }] } as any);

      await expect(resolvers.Mutation.deleteCV(null, { id: 'cv1' })).rejects.toThrow('Forbidden');
    });

    it('should return 0 if CV not found', async () => {
      mockCheckAuth.mockResolvedValue({ isAuthenticated: true, isAdmin: true, userId: 1 });
      mockPool.query.mockResolvedValueOnce({ rows: [] } as any);

      const result = await resolvers.Mutation.deleteCV(null, { id: 'cv1' });
      expect(result).toBe(0);
    });
  });

  describe('Mutation.updateCVSkills', () => {
    const skills = [{ name: 'JavaScript', mastery: 'Expert' }];

    it('should update skills when authorized', async () => {
      mockCheckAuth.mockResolvedValue({ isAuthenticated: true, isAdmin: false, userId: 2 });
      mockPool.query
        .mockResolvedValueOnce({ rows: [{ userId: 2 }] } as any)
        .mockResolvedValueOnce({} as any)
        .mockResolvedValueOnce({ rows: [{ id: 'cv1', name: 'CV', skills: JSON.stringify(skills) }] } as any);

      const result = await resolvers.Mutation.updateCVSkills(null, { id: 'cv1', skills });
      expect(result.skills).toEqual(skills);
    });

    it('should throw Forbidden if unauthorized', async () => {
      mockCheckAuth.mockResolvedValue({ isAuthenticated: true, isAdmin: false, userId: 99 });
      mockPool.query.mockResolvedValueOnce({ rows: [{ userId: 2 }] } as any);

      await expect(resolvers.Mutation.updateCVSkills(null, { id: 'cv1', skills })).rejects.toThrow('Forbidden');
    });
  });

  describe('Mutation.upsertCvProject', () => {
    const projectInput = {
      name: 'New Project',
      domain: 'Web',
      startDate: '2023-01-01',
      endDate: '2023-12-31',
      description: 'Desc',
      responsibilities: ['dev'],
      environment: ['Node'],
    };

    it('should insert new project and link to CV', async () => {
      mockCheckAuth.mockResolvedValue({ isAuthenticated: true, isAdmin: false, userId: 2 });
      const client = {
        query: jest.fn(),
        release: jest.fn(),
      };
      mockPool.connect.mockResolvedValue(client as any);
      mockPool.query
        .mockResolvedValueOnce({ rows: [{ userId: 2 }] } as any) 
        .mockResolvedValueOnce({ rows: [{ id: 'newCvProjId', projectId: 'newProjId', name: 'New Project', domain: 'Web', description: 'Desc', environment: ['Node'] }] } as any);

      client.query
        .mockResolvedValueOnce({}) 
        .mockResolvedValueOnce({ rows: [{ id: 'newProjId' }] }) 
        .mockResolvedValueOnce({ rows: [] }) 
        .mockResolvedValueOnce({ rows: [{ id: 'newCvProjId' }] }) 
        .mockResolvedValueOnce({}) 
        .mockResolvedValueOnce({}); 

      const result = await resolvers.Mutation.upsertCvProject(null, { cvId: 'cv1', project: projectInput });

      expect(result.id).toBe('newCvProjId');
      expect(client.query).toHaveBeenCalledTimes(6);
    });

    it('should throw Forbidden if unauthorized', async () => {
      mockCheckAuth.mockResolvedValue({ isAuthenticated: true, isAdmin: false, userId: 99 });
      mockPool.query.mockResolvedValueOnce({ rows: [{ userId: 2 }] } as any);

      await expect(resolvers.Mutation.upsertCvProject(null, { cvId: 'cv1', project: projectInput })).rejects.toThrow('Forbidden');
    });
  });

  describe('Mutation.deleteCvProject', () => {
    it('should delete project when authorized', async () => {
      mockCheckAuth.mockResolvedValue({ isAuthenticated: true, isAdmin: false, userId: 2 });
      mockPool.query
        .mockResolvedValueOnce({ rows: [{ userId: 2 }] } as any)
        .mockResolvedValueOnce({} as any) 
        .mockResolvedValueOnce({ rowCount: 1 } as any); 

      const result = await resolvers.Mutation.deleteCvProject(null, { cvId: 'cv1', cvProjectId: 'cp1' });
      expect(result).toBe(1);
    });

    it('should throw Forbidden if unauthorized', async () => {
      mockCheckAuth.mockResolvedValue({ isAuthenticated: true, isAdmin: false, userId: 99 });
      mockPool.query.mockResolvedValueOnce({ rows: [{ userId: 2 }] } as any);

      await expect(resolvers.Mutation.deleteCvProject(null, { cvId: 'cv1', cvProjectId: 'cp1' })).rejects.toThrow('Forbidden');
    });

    it('should return 0 if CV not found', async () => {
      mockCheckAuth.mockResolvedValue({ isAuthenticated: true, isAdmin: true, userId: 1 });
      mockPool.query.mockResolvedValueOnce({ rows: [] } as any);

      const result = await resolvers.Mutation.deleteCvProject(null, { cvId: 'cv1', cvProjectId: 'cp1' });
      expect(result).toBe(0);
    });
  });
});