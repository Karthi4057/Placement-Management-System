import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { User, Mail, Phone, BookOpen, Award, FileText, Upload } from 'lucide-react';

interface User {
  name?: string;
  email?: string;
  contactNumber?: string;
  registerNumber?: string;
  department?: string;
  year?: string;
  cgpa?: string;
  skills?: string[];
  profilePhoto?: string;
  resume?: string;
}

interface FormData {
  name: string;
  email: string;
  contactNumber: string;
  registerNumber: string;
  department: string;
  year: string;
  cgpa: string;
  skills: string;
}

interface EditProfileFormProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  user: User | null;
  handlePhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleResumeUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  user,
  handlePhotoUpload,
  handleResumeUpload,
}) => (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-bold">Edit Profile</h1>
      <p className="text-muted-foreground mt-1">Fill in your personal and academic details</p>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Please enter all required details below</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center overflow-hidden">
                {user?.profilePhoto ? (
                  <img src={user.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-primary" />
                )}
              </div>
              <Label htmlFor="photo-upload" className="absolute bottom-0 right-0 cursor-pointer">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Upload className="w-4 h-4 text-primary-foreground" />
                </div>
                <Input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
              </Label>
            </div>
            <div className="flex-1">
              <Label htmlFor="resume-upload">Upload Resume</Label>
              <div className="text-sm text-muted-foreground mb-1">PDF, DOC, DOCX only</div>
              <Input id="resume-upload" type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@domain.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact">Contact Number</Label>
              <Input
                id="contact"
                placeholder="+91 9876543210"
                value={formData.contactNumber}
                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="register">Register Number *</Label>
              <Input
                id="register"
                placeholder="your-register-number"
                value={formData.registerNumber}
                onChange={(e) => setFormData({ ...formData, registerNumber: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Input
                id="department"
                placeholder="Computer Science"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Year *</Label>
              <Input
                id="year"
                placeholder="2021"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cgpa">CGPA *</Label>
              <Input
                id="cgpa"
                placeholder="8.5"
                value={formData.cgpa}
                onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="skills">Skills (comma-separated)</Label>
            <Input
              id="skills"
              placeholder="JavaScript, React, Node.js, Python"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit">Save Changes</Button>
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
);

const StudentProfile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  // Start with completely EMPTY form — no defaults from user
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    contactNumber: '',
    registerNumber: '',
    department: '',
    year: '',
    cgpa: '',
    skills: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const skillsArray = formData.skills
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    updateUser({
      ...formData,
      skills: skillsArray,
    });

    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateUser({ profilePhoto: reader.result as string });
        toast.success('Profile photo updated!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateUser({ resume: file.name });
      toast.success('Resume uploaded: ' + file.name);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Optionally reset form if needed
    setFormData({
      name: '',
      email: '',
      contactNumber: '',
      registerNumber: '',
      department: '',
      year: '',
      cgpa: '',
      skills: '',
    });
  };

  // View Mode
  if (!isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="text-muted-foreground mt-1">View and manage your profile information</p>
          </div>
          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-6">
              <div className="relative">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center overflow-hidden">
                  {user?.profilePhoto ? (
                    <img src={user.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-primary" />
                  )}
                </div>
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-2xl font-bold">{user?.name || 'Not set'}</h2>
                  <p className="text-muted-foreground">{user?.email || 'No email'}</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{user?.contactNumber || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                    <span>{user?.registerNumber || 'Not set'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-muted-foreground" />
                    <span>CGPA: {user?.cgpa || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span>{user?.resume || 'No resume uploaded'}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {user?.skills && user.skills.length > 0 ? (
                      user.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">{skill}</Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground text-sm">No skills added</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Edit Mode — Completely Blank Form
  return (
    <EditProfileForm
      formData={formData}
      setFormData={setFormData}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      user={user}
      handlePhotoUpload={handlePhotoUpload}
      handleResumeUpload={handleResumeUpload}
    />
  );
};

export default StudentProfile;