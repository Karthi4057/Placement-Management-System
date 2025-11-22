import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Download, Eye, Users, Trash2 } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Registration {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  companyId: string;
  companyName: string;
  department: string;
  percentage10th: string;
  percentage12th: string;
  ugCgpa: string;
  resume: string;
  registeredAt: string;
}

const RegisteredStudentsPage = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const savedRegistrations = localStorage.getItem('registrations');
    if (savedRegistrations) {
      setRegistrations(JSON.parse(savedRegistrations));
    }
  }, []);

  const downloadAllPDF = () => {
    const doc = new jsPDF();
   
    doc.setFontSize(18);
    doc.text('Registered Students Report', 14, 20);
    doc.setFontSize(11);
    doc.text(`Total Registrations: ${registrations.length}`, 14, 30);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 36);
    const tableData = registrations.map(reg => [
      reg.studentName,
      reg.studentEmail,
      reg.companyName,
      reg.department,
      reg.percentage10th + '%',
      reg.percentage12th + '%',
      reg.ugCgpa,
      new Date(reg.registeredAt).toLocaleDateString()
    ]);
    autoTable(doc, {
      head: [['Name', 'Email', 'Company', 'Department', '10th %', '12th %', 'CGPA', 'Date']],
      body: tableData,
      startY: 42,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [59, 130, 246] }
    });
    doc.save('registered-students.pdf');
  };

  const downloadSinglePDF = (registration: Registration) => {
    const doc = new jsPDF();
   
    doc.setFontSize(18);
    doc.text('Student Registration Details', 14, 20);
   
    doc.setFontSize(12);
    let y = 35;
    const lineHeight = 10;
   
    doc.text(`Name: ${registration.studentName}`, 14, y);
    y += lineHeight;
    doc.text(`Email: ${registration.studentEmail}`, 14, y);
    y += lineHeight;
    doc.text(`Company: ${registration.companyName}`, 14, y);
    y += lineHeight;
    doc.text(`Department: ${registration.department}`, 14, y);
    y += lineHeight;
    doc.text(`10th Percentage: ${registration.percentage10th}%`, 14, y);
    y += lineHeight;
    doc.text(`12th Percentage: ${registration.percentage12th}%`, 14, y);
    y += lineHeight;
    doc.text(`UG CGPA: ${registration.ugCgpa}`, 14, y);
    y += lineHeight;
    doc.text(`Registered On: ${new Date(registration.registeredAt).toLocaleString()}`, 14, y);
    doc.save(`${registration.studentName}-${registration.companyName}.pdf`);
  };

  const handleDeleteAll = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDeleteAll = () => {
    setRegistrations([]);
    localStorage.removeItem('registrations');
    setShowDeleteConfirm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Registered Students</h1>
          <p className="text-muted-foreground mt-1">View all student registrations for placement drives</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={downloadAllPDF} disabled={registrations.length === 0}>
            <Download className="w-4 h-4 mr-2" />
            Download All (PDF)
          </Button>
          {registrations.length > 0 && (
            <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
              <DialogTrigger asChild>
                <Button variant="destructive" onClick={handleDeleteAll}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete All
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Delete All</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete all registrations? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={confirmDeleteAll}>
                    Delete All
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{registrations.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Students</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(registrations.map(r => r.studentId)).size}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Companies Applied</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(registrations.map(r => r.companyId)).size}
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Registrations</CardTitle>
          <CardDescription>Complete list of student registrations</CardDescription>
        </CardHeader>
        <CardContent>
          {registrations.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No registrations yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>CGPA</TableHead>
                  <TableHead>Registered On</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registrations.map((registration) => (
                  <TableRow key={registration.id}>
                    <TableCell className="font-medium">{registration.studentName}</TableCell>
                    <TableCell>{registration.studentEmail}</TableCell>
                    <TableCell>{registration.companyName}</TableCell>
                    <TableCell>{registration.department}</TableCell>
                    <TableCell>{registration.ugCgpa}</TableCell>
                    <TableCell>{new Date(registration.registeredAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedRegistration(registration)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Registration Details</DialogTitle>
                              <DialogDescription>
                                Complete information for {registration.studentName}
                              </DialogDescription>
                            </DialogHeader>
                            {selectedRegistration && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">Student Name</p>
                                    <p className="text-sm">{selectedRegistration.studentName}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                                    <p className="text-sm">{selectedRegistration.studentEmail}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">Company</p>
                                    <p className="text-sm">{selectedRegistration.companyName}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">Department</p>
                                    <p className="text-sm">{selectedRegistration.department}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">10th Percentage</p>
                                    <p className="text-sm">{selectedRegistration.percentage10th}%</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">12th Percentage</p>
                                    <p className="text-sm">{selectedRegistration.percentage12th}%</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">UG CGPA</p>
                                    <p className="text-sm">{selectedRegistration.ugCgpa}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">Registered On</p>
                                    <p className="text-sm">{new Date(selectedRegistration.registeredAt).toLocaleString()}</p>
                                  </div>
                                </div>
                                {selectedRegistration.resume && (
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-2">Resume</p>
                                    <a
                                      href={selectedRegistration.resume}
                                      download={`${selectedRegistration.studentName}-resume.pdf`}
                                      className="text-sm text-primary hover:underline"
                                    >
                                      Download Resume
                                    </a>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisteredStudentsPage;