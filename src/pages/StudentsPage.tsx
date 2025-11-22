'use client';
import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Users, Search, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface Student {
  id: string;
  name: string;
  registerNumber: string;
  email: string;
  department: string;
  year: string;
  cgpa: string;
  skills: string;
  contactNumber: string;
  placed: string;
  placedCompany?: string;
}

interface FormData {
  name: string;
  registerNumber: string;
  email: string;
  department: string;
  year: string;
  cgpa: string;
  skills: string;
  contactNumber: string;
  placed: string;
  placedCompany: string;
}

/* -------------------------------------------------------------------------- */
/*                               STUDENT FORM                                 */
/* -------------------------------------------------------------------------- */
const StudentForm: React.FC<{
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  editingStudent: Student | null;
  onSubmit: (e: React.FormEvent) => void;
  onCancel?: () => void;
}> = ({ formData, setFormData, editingStudent, onSubmit, onCancel }) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="registerNumber">Register Number</Label>
        <Input
          id="registerNumber"
          value={formData.registerNumber}
          onChange={(e) => setFormData({ ...formData, registerNumber: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contactNumber">Contact Number</Label>
        <Input
          id="contactNumber"
          value={formData.contactNumber}
          onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="department">Department</Label>
        <Input
          id="department"
          value={formData.department}
          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="year">Year</Label>
        <Input
          id="year"
          value={formData.year}
          onChange={(e) => setFormData({ ...formData, year: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="cgpa">CGPA</Label>
        <Input
          id="cgpa"
          value={formData.cgpa}
          onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="skills">Skills</Label>
        <Input
          id="skills"
          value={formData.skills}
          onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
          placeholder="JavaScript, React, etc."
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="placed">Placement Status</Label>
        <Input
          id="placed"
          value={formData.placed}
          onChange={(e) => setFormData({ ...formData, placed: e.target.value })}
          placeholder="Yes/No"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="placedCompany">Placed Company (if applicable)</Label>
        <Input
          id="placedCompany"
          value={formData.placedCompany}
          onChange={(e) => setFormData({ ...formData, placedCompany: e.target.value })}
          placeholder="Company name"
        />
      </div>
    </div>

    <div className="flex gap-3">
      <Button type="submit">{editingStudent ? 'Update' : 'Add'} Student</Button>
      {editingStudent && onCancel && (
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      )}
    </div>
  </form>
);

/* -------------------------------------------------------------------------- */
/*                               MAIN PAGE                                    */
/* -------------------------------------------------------------------------- */
const StudentsPage = () => {
  const tableRef = useRef<HTMLTableElement>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    registerNumber: '',
    email: '',
    department: '',
    year: '',
    cgpa: '',
    skills: '',
    contactNumber: '',
    placed: 'No',
    placedCompany: '',
  });

  const initialFormData = { ...formData };

  /* ---------- Load from localStorage ---------- */
  useEffect(() => {
    const saved = localStorage.getItem('students');
    if (saved) setStudents(JSON.parse(saved));
  }, []);

  const saveStudents = (list: Student[]) => {
    localStorage.setItem('students', JSON.stringify(list));
    setStudents(list);
  };

  /* ---------- CRUD Handlers ---------- */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStudent) {
      const updated = students.map((s) =>
        s.id === editingStudent.id
          ? { ...formData, id: s.id, placedCompany: formData.placedCompany || undefined }
          : s
      );
      saveStudents(updated);
      toast.success('Student updated');
      setEditingStudent(null);
    } else {
      const newS = {
        ...formData,
        id: Date.now().toString(),
        placedCompany: formData.placedCompany || undefined,
      };
      saveStudents([...students, newS]);
      toast.success('Student added');
      setIsAddOpen(false);
    }
    setFormData(initialFormData);
  };

  const handleEdit = (s: Student) => {
    setEditingStudent(s);
    setFormData({ ...s, placedCompany: s.placedCompany || '' });
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this student?')) {
      saveStudents(students.filter((s) => s.id !== id));
      toast.success('Student deleted');
    }
  };

  const handleCancelEdit = () => {
    setEditingStudent(null);
    setFormData(initialFormData);
  };

  /* ---------- PDF DOWNLOAD (BLUE BUTTON) ---------- */
  const downloadPDF = async () => {
    if (!tableRef.current || students.length === 0) {
      toast.error('No data to export');
      return;
    }

    toast.info('Generating PDF...');
    const canvas = await html2canvas(tableRef.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save('Students_List.pdf');
    toast.success('PDF downloaded!');
  };

  /* ---------- FILTERED LIST ---------- */
  const filtered = searchTerm
    ? students.filter(
        (s) =>
          s.placed === 'Yes' &&
          s.placedCompany?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : students;

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Students</h1>
          <p className="text-muted-foreground mt-1">Manage student records</p>
        </div>

        <div className="flex gap-2">
          {/* BLUE DOWNLOAD BUTTON */}
          <Button
            onClick={downloadPDF}
            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium"
          >
            <Download className="w-4 h-4" />
            Download All (PDF)
          </Button>

          {/* Add Student Dialog */}
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
                <DialogDescription>Fill in student details</DialogDescription>
              </DialogHeader>
              <StudentForm
                formData={formData}
                setFormData={setFormData}
                editingStudent={null}
                onSubmit={handleSubmit}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search placed students by company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Edit Form */}
      {editingStudent && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Edit Student</CardTitle>
          </CardHeader>
          <CardContent>
            <StudentForm
              formData={formData}
              setFormData={setFormData}
              editingStudent={editingStudent}
              onSubmit={handleSubmit}
              onCancel={handleCancelEdit}
            />
          </CardContent>
        </Card>
      )}

      {/* Table – Straight Lines */}
      {filtered.length > 0 ? (
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <Table ref={tableRef} className="border-collapse">
              <TableHeader>
                <TableRow className="border-b">
                  <TableHead className="border-r">Name</TableHead>
                  <TableHead className="border-r">Register No.</TableHead>
                  <TableHead className="border-r">Email</TableHead>
                  <TableHead className="border-r">Department</TableHead>
                  <TableHead className="border-r">Year</TableHead>
                  <TableHead className="border-r">CGPA</TableHead>
                  <TableHead className="border-r">Placed</TableHead>
                  <TableHead className="border-r">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((s) => (
                  <TableRow key={s.id} className="border-b">
                    <TableCell className="border-r font-medium">{s.name}</TableCell>
                    <TableCell className="border-r">{s.registerNumber}</TableCell>
                    <TableCell className="border-r">{s.email}</TableCell>
                    <TableCell className="border-r">{s.department}</TableCell>
                    <TableCell className="border-r">{s.year}</TableCell>
                    <TableCell className="border-r">{s.cgpa}</TableCell>
                    <TableCell className="border-r">
                      {s.placed === 'Yes' ? (
                        <span className="text-green-600 font-medium">
                          Yes ({s.placedCompany || 'N/A'})
                        </span>
                      ) : (
                        <span className="text-muted-foreground">No</span>
                      )}
                    </TableCell>
                    <TableCell className="border-r">
                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEdit(s)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDelete(s.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : searchTerm ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No students placed in a company matching “{searchTerm}”
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No students added yet</p>
            <p className="text-sm text-muted-foreground">
              Click “Add Student” to get started
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudentsPage;
