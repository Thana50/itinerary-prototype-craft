
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, CheckCircle, DollarSign, Percent } from "lucide-react";

const StatsCards = () => {
  const stats = [
    {
      title: "Active Negotiations",
      value: "3",
      icon: Briefcase,
      color: "purple"
    },
    {
      title: "Completed This Week",
      value: "12",
      icon: CheckCircle,
      color: "green"
    },
    {
      title: "Total Savings",
      value: "$1,847",
      icon: DollarSign,
      color: "blue"
    },
    {
      title: "Success Rate",
      value: "89%",
      icon: Percent,
      color: "indigo"
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      purple: "bg-purple-100 text-purple-600",
      green: "bg-green-100 text-green-600",
      blue: "bg-blue-100 text-blue-600",
      indigo: "bg-indigo-100 text-indigo-600"
    };
    return colorMap[color as keyof typeof colorMap] || "bg-gray-100 text-gray-600";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-white">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className={`p-3 ${getColorClasses(stat.color).split(' ')[0]} rounded-lg mr-4`}>
                <stat.icon className={`h-6 w-6 ${getColorClasses(stat.color).split(' ')[1]}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className={`text-3xl font-bold ${getColorClasses(stat.color).split(' ')[1]}`}>{stat.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;
