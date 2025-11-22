import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, Layers, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    companies: 0,
    students: 0,
    rounds: 0,
    registrations: 0,
  });

  useEffect(() => {
    const companies = JSON.parse(localStorage.getItem('companies') || '[]');
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const rounds = JSON.parse(localStorage.getItem('rounds') || '[]');
    const registrations = JSON.parse(localStorage.getItem('registrations') || '[]');
    
    setStats({
      companies: companies.length,
      students: students.length,
      rounds: rounds.length,
      registrations: registrations.length,
    });
  }, []);

  const dashboardStats = [
    { title: 'Total Companies', value: stats.companies, icon: Building2, color: 'text-blue-600' },
    { title: 'Total Students', value: stats.students, icon: Users, color: 'text-green-600' },
    { title: 'Total Rounds', value: stats.rounds, icon: Layers, color: 'text-purple-600' },
    { title: 'Registered Students', value: stats.registrations, icon: TrendingUp, color: 'text-orange-600' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of campus placement activities</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat) => (
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

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">No recent activities</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>• Add new companies</p>
              <p>• Manage student records</p>
              <p>• Create placement rounds</p>
              <p>• View analytics</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
