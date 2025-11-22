import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Building2 } from 'lucide-react';

interface Company {
  id: string;
  name: string;
  date: string;
  ctc: string;
  role: string;
  eligibility: string;
  jobType: string;
  skills: string;
}

interface FormData {
  name: string;
  date: string;
  ctc: string;
  role: string;
  eligibility: string;
  jobType: string;
  skills: string;
}

interface CompanyFormProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onSubmit: (e: React.FormEvent) => void;
  isEditing?: boolean;
  onCancel?: () => void;
}

const CompanyForm: React.FC<CompanyFormProps> = ({ 
  formData, 
  setFormData, 
  onSubmit, 
  isEditing = false, 
  onCancel 
}) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="name">Company Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="date">Drive Date</Label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="role">Job Role</Label>
        <Input
          id="role"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="ctc">CTC (in LPA)</Label>
        <Input
          id="ctc"
          value={formData.ctc}
          onChange={(e) => setFormData({ ...formData, ctc: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="jobType">Job Type</Label>
        <Input
          id="jobType"
          value={formData.jobType}
          onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="eligibility">Eligibility (Min CGPA)</Label>
        <Input
          id="eligibility"
          value={formData.eligibility}
          onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
          required
        />
      </div>
    </div>
    <div className="space-y-2">
      <Label htmlFor="skills">Required Skills</Label>
      <Input
        id="skills"
        value={formData.skills}
        onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
        placeholder="JavaScript, React, Node.js"
        required
      />
    </div>
    <div className="flex gap-3">
      <Button type="submit">{isEditing ? 'Update' : 'Add'} Company</Button>
      {isEditing && onCancel && (
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      )}
    </div>
  </form>
);

const CompaniesPage = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    date: '',
    ctc: '',
    role: '',
    eligibility: '',
    jobType: 'Full-time',
    skills: '',
  });

  const initialFormData: FormData = {
    name: '',
    date: '',
    ctc: '',
    role: '',
    eligibility: '',
    jobType: 'Full-time',
    skills: '',
  };

  useEffect(() => {
    const saved = localStorage.getItem('companies');
    if (saved) {
      setCompanies(JSON.parse(saved));
    }
  }, []);

  const saveCompanies = (updatedCompanies: Company[]) => {
    localStorage.setItem('companies', JSON.stringify(updatedCompanies));
    setCompanies(updatedCompanies);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCompany) {
      const updated = companies.map(c => 
        c.id === editingCompany.id ? { ...formData, id: c.id } : c
      );
      saveCompanies(updated);
      toast.success('Company updated successfully!');
      setEditingCompany(null);
    } else {
      const newCompany = { ...formData, id: Date.now().toString() };
      saveCompanies([...companies, newCompany]);
      toast.success('Company added successfully!');
      setIsAddOpen(false);
    }
    
    setFormData(initialFormData);
  };

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setFormData({
      name: company.name,
      date: company.date,
      ctc: company.ctc,
      role: company.role,
      eligibility: company.eligibility,
      jobType: company.jobType,
      skills: company.skills,
    });
  };

  const handleDelete = (id: string) => {
    saveCompanies(companies.filter(c => c.id !== id));
    toast.success('Company deleted successfully!');
  };

  const handleCancelEdit = () => {
    setEditingCompany(null);
    setFormData(initialFormData);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Companies</h1>
          <p className="text-muted-foreground mt-1">Manage company placement drives</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Company
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Company</DialogTitle>
              <DialogDescription>Fill in the details of the placement drive</DialogDescription>
            </DialogHeader>
            <CompanyForm 
              formData={formData} 
              setFormData={setFormData} 
              onSubmit={handleSubmit} 
              isEditing={false} 
            />
          </DialogContent>
        </Dialog>
      </div>

      {editingCompany && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Edit Company</CardTitle>
            <CardDescription>Update company details</CardDescription>
          </CardHeader>
          <CardContent>
            <CompanyForm 
              formData={formData} 
              setFormData={setFormData} 
              onSubmit={handleSubmit} 
              isEditing={true} 
              onCancel={handleCancelEdit}
            />
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {companies.map((company) => (
          <Card key={company.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>{company.name}</CardTitle>
                    <CardDescription>{company.role}</CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost" onClick={() => handleEdit(company)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(company.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">CTC:</span>
                  <span className="font-medium">{company.ctc} LPA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-medium">{company.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="font-medium">{company.jobType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Min CGPA:</span>
                  <span className="font-medium">{company.eligibility}</span>
                </div>
                <div className="pt-2">
                  <span className="text-muted-foreground text-xs">Skills: </span>
                  <span className="text-xs">{company.skills}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {companies.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Building2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No companies added yet</p>
            <p className="text-sm text-muted-foreground">Click "Add Company" to get started</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CompaniesPage;