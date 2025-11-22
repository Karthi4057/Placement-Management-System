import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  Building2,
  Briefcase,
  FileText,
  TrendingUp,
  Eye,
  UserPlus,
} from 'lucide-react';

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

interface Question {
  question: string;
  answer: string;
}

interface Round {
  id: string;
  companyId: string;
  companyName: string;
  roundName: string;
  roundType: string;
  mode: string;
  difficulty: string;
  questions: Question[];
}

interface Registration {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  registrationNumber: string;
  companyId: string;
  companyName: string;
  department: string;
  percentage10th: string;
  percentage12th: string;
  ugCgpa: string;
  resume: string;
  registeredAt: string;
}

const StudentDashboard = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    fullName: '',
    registrationNumber: '',
    department: '',
    percentage10th: '',
    percentage12th: '',
    ugCgpa: '',
    resume: '',
  });

  const { user } = useAuth();
  const { toast } = useToast();

  /* ------------------------------------------------------------------ */
  /*  FIXED DATA – IBM + 3 rounds (Aptitude, Coding, HR)                */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    const savedCompanies = localStorage.getItem('companies');
    const savedRounds = localStorage.getItem('rounds');

    if (!savedCompanies || !savedRounds) {
      // ---- IBM company ------------------------------------------------
      const ibm: Company = {
        id: '1',
        name: 'IBM',
        date: '15 Nov 2025',
        ctc: '12',
        role: 'Software Engineer',
        eligibility: '7.0',
        jobType: 'Full-time',
        skills: 'Java, Python, DSA, Cloud',
      };

      // ---- IBM rounds -------------------------------------------------
      const ibmRounds: Round[] = [
        {
          id: 'r1',
          companyId: '1',
          companyName: 'IBM',
          roundName: 'Aptitude',
          roundType: 'MCQ',
          mode: 'Online',
          difficulty: 'Medium',
          questions: [
            {
              question:
                'A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?',
              answer: '45',
            },
          ],
        },
        {
          id: 'r2',
          companyId: '1',
          companyName: 'IBM',
          roundName: 'Coding',
          roundType: 'Programming',
          mode: 'Online',
          difficulty: 'Medium',
          questions: [
            {
              question: 'Reverse String input : hi',
              answer: 'output : ih',
            },
          ],
        },
        {
          id: 'r3',
          companyId: '1',
          companyName: 'IBM',
          roundName: 'HR',
          roundType: 'Interview',
          mode: 'Online',
          difficulty: 'Medium',
          questions: [
            {
              question: 'Self Introduction Project Explanation',
              answer: '',
            },
          ],
        },
      ];

      // Persist to localStorage (so the UI works without a backend)
      localStorage.setItem('companies', JSON.stringify([ibm]));
      localStorage.setItem('rounds', JSON.stringify(ibmRounds));

      setCompanies([ibm]);
      setRounds(ibmRounds);
    } else {
      setCompanies(JSON.parse(savedCompanies));
      setRounds(JSON.parse(savedRounds));
    }
  }, []);
  /* ------------------------------------------------------------------ */

  const getCompanyRounds = (companyId: string) => {
    return rounds.filter((round) => round.companyId === companyId);
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRegistrationData({ ...registrationData, resume: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegister = () => {
    if (!selectedCompany || !user) return;

    const registration: Registration = {
      id: Date.now().toString(),
      studentId: user.id,
      studentName: registrationData.fullName,
      studentEmail: user.email,
      registrationNumber: registrationData.registrationNumber,
      companyId: selectedCompany.id,
      companyName: selectedCompany.name,
      department: registrationData.department,
      percentage10th: registrationData.percentage10th,
      percentage12th: registrationData.percentage12th,
      ugCgpa: registrationData.ugCgpa,
      resume: registrationData.resume,
      registeredAt: new Date().toISOString(),
    };

    const existingRegistrations = JSON.parse(
      localStorage.getItem('registrations') || '[]'
    );
    localStorage.setItem(
      'registrations',
      JSON.stringify([...existingRegistrations, registration])
    );

    toast({
      title: 'Registration Successful!',
      description: `You have successfully registered for ${selectedCompany.name}`,
    });

    setRegisterDialogOpen(false);
    setRegistrationData({
      fullName: '',
      registrationNumber: '',
      department: '',
      percentage10th: '',
      percentage12th: '',
      ugCgpa: '',
      resume: '',
    });
  };

  const stats = [
    { title: 'Total Companies', value: companies.length, icon: Building2, color: 'text-blue-600' },
    { title: 'Eligible Drives', value: companies.length, icon: Briefcase, color: 'text-green-600' },
    { title: 'Applications', value: '0', icon: FileText, color: 'text-purple-600' },
    { title: 'Placement Rate', value: '75%', icon: TrendingUp, color: 'text-orange-600' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome Back!</h1>
        <p className="text-muted-foreground mt-1">
          Track your placement journey and opportunities
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Placement Drives</CardTitle>
          <CardDescription>Companies visiting campus this semester</CardDescription>
        </CardHeader>
        <CardContent>
          {companies.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No companies registered yet
            </p>
          ) : (
            <div className="space-y-4">
              {companies.map((company) => {
                const companyRounds = getCompanyRounds(company.id);
                return (
                  <div
                    key={company.id}
                    className="flex items-start gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-6 h-6 text-primary" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg">{company.name}</h3>
                      <p className="text-sm text-muted-foreground">{company.role}</p>

                      <div className="flex flex-wrap gap-4 mt-2 text-sm">
                        <span className="text-muted-foreground">
                          CTC: <span className="font-medium text-foreground">{company.ctc} LPA</span>
                        </span>
                        <span className="text-muted-foreground">
                          Date: <span className="font-medium text-foreground">{company.date}</span>
                        </span>
                        <span className="text-muted-foreground">
                          Type: <span className="font-medium text-foreground">{company.jobType}</span>
                        </span>
                        <span className="text-muted-foreground">
                          Min CGPA: <span className="font-medium text-foreground">{company.eligibility}</span>
                        </span>
                      </div>

                      <div className="mt-2 text-sm">
                        <span className="text-muted-foreground">Skills: </span>
                        <span className="text-sm">{company.skills}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {/* ---------- REGISTER DIALOG ---------- */}
                      <Dialog open={registerDialogOpen} onOpenChange={setRegisterDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => setSelectedCompany(company)}
                          >
                            <UserPlus className="w-4 h-4 mr-2" />
                            Register
                          </Button>
                        </DialogTrigger>

                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Register for {company.name}</DialogTitle>
                            <DialogDescription>
                              Fill in your details to register for this placement drive
                            </DialogDescription>
                          </DialogHeader>

                          <div className="space-y-4">
                            <div className="grid gap-2">
                              <Label htmlFor="name">Full Name</Label>
                              <Input
                                id="name"
                                type="text"
                                placeholder="Enter your full name"
                                value={registrationData.fullName}
                                onChange={(e) =>
                                  setRegistrationData({
                                    ...registrationData,
                                    fullName: e.target.value,
                                  })
                                }
                                required
                              />
                            </div>

                            <div className="grid gap-2">
                              <Label htmlFor="regNumber">Registration Number</Label>
                              <Input
                                id="regNumber"
                                type="text"
                                placeholder="Enter your registration number"
                                value={registrationData.registrationNumber}
                                onChange={(e) =>
                                  setRegistrationData({
                                    ...registrationData,
                                    registrationNumber: e.target.value,
                                  })
                                }
                                required
                              />
                            </div>

                            <div className="grid gap-2">
                              <Label>Company Name</Label>
                              <Input
                                value={selectedCompany?.name || ''}
                                readOnly
                                className="bg-muted"
                              />
                            </div>

                            <div className="grid gap-2">
                              <Label htmlFor="department">Department</Label>
                              <Input
                                id="department"
                                type="text"
                                placeholder="e.g., Computer Science"
                                value={registrationData.department}
                                onChange={(e) =>
                                  setRegistrationData({
                                    ...registrationData,
                                    department: e.target.value,
                                  })
                                }
                                required
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="grid gap-2">
                                <Label htmlFor="percentage10th">10th Percentage</Label>
                                <Input
                                  id="percentage10th"
                                  type="text"
                                  placeholder="e.g., 85.5"
                                  value={registrationData.percentage10th}
                                  onChange={(e) =>
                                    setRegistrationData({
                                      ...registrationData,
                                      percentage10th: e.target.value,
                                    })
                                  }
                                  required
                                />
                              </div>

                              <div className="grid gap-2">
                                <Label htmlFor="percentage12th">12th Percentage</Label>
                                <Input
                                  id="percentage12th"
                                  type="text"
                                  placeholder="e.g., 88.2"
                                  value={registrationData.percentage12th}
                                  onChange={(e) =>
                                    setRegistrationData({
                                      ...registrationData,
                                      percentage12th: e.target.value,
                                    })
                                  }
                                  required
                                />
                              </div>
                            </div>

                            <div className="grid gap-2">
                              <Label htmlFor="ugCgpa">UG CGPA</Label>
                              <Input
                                id="ugCgpa"
                                type="text"
                                placeholder="e.g., 8.5"
                                value={registrationData.ugCgpa}
                                onChange={(e) =>
                                  setRegistrationData({
                                    ...registrationData,
                                    ugCgpa: e.target.value,
                                  })
                                }
                                required
                              />
                            </div>

                            <div className="grid gap-2">
                              <Label htmlFor="resume">Upload Resume (PDF)</Label>
                              <Input
                                id="resume"
                                type="file"
                                accept=".pdf"
                                onChange={handleResumeUpload}
                                required
                              />
                            </div>

                            <Button onClick={handleRegister} className="w-full">
                              Submit Registration
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      {/* ---------- VIEW QUESTIONS DIALOG ---------- */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedCompany(company)}
                            disabled={companyRounds.length === 0}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Questions
                          </Button>
                        </DialogTrigger>

                        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>{company.name} - Interview Questions</DialogTitle>
                            <DialogDescription>
                              Previous year questions and answers
                            </DialogDescription>
                          </DialogHeader>

                          <div className="space-y-4">
                            {companyRounds.length === 0 ? (
                              <p className="text-center text-muted-foreground py-8">
                                No questions available yet
                              </p>
                            ) : (
                              companyRounds.map((round) => (
                                <Card key={round.id}>
                                  <CardHeader>
                                    <CardTitle className="text-lg">{round.roundName}</CardTitle>
                                    <CardDescription>
                                      {round.roundType} • {round.mode} • {round.difficulty}
                                    </CardDescription>
                                  </CardHeader>

                                  <CardContent className="space-y-3">
                                    {round.questions.map((q, idx) => (
                                      <div
                                        key={idx}
                                        className="p-3 bg-muted/50 rounded-lg space-y-2"
                                      >
                                        <p className="font-medium text-sm">
                                          Q{idx + 1}: {q.question}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                          A: {q.answer}
                                        </p>
                                      </div>
                                    ))}
                                  </CardContent>
                                </Card>
                              ))
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;