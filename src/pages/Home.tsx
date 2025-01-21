import { useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import {
    ShoppingCart,
    ListChecks,
    TrendingUp,
    Users,
    ArrowRight,
} from "lucide-react";
import { Link } from 'react-router-dom';

const HomePage = () => {
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Header with glass effect */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <div className="bg-blue-600 p-2 rounded-lg">
                                <ShoppingCart className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 text-transparent bg-clip-text">
                                ShopManager
                            </span>
                        </div>

                        <NavigationMenu className="hidden md:block">
                            <NavigationMenuList>
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className="hover:text-blue-600 transition-colors">
                                        Dashboard
                                    </NavigationMenuTrigger>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className="hover:text-blue-600 transition-colors">
                                        Lists
                                    </NavigationMenuTrigger>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className="hover:text-blue-600 transition-colors">
                                        Analytics
                                    </NavigationMenuTrigger>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className="hover:text-blue-600 transition-colors">
                                        Settings
                                    </NavigationMenuTrigger>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>

                        <div className="flex space-x-4 items-center">
                            <Link to={'/auth'}>
                                <Button variant="ghost" className="hidden md:flex hover:text-blue-600">
                                    Log In
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section with gradient and pattern */}
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-gray-50">
                <div className="absolute inset-0 opacity-20 bg-grid-pattern" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
                    <div className="text-center">
                        <div className="inline-block mb-4">
                            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-4 py-1 rounded-full">
                                New Features Available
                            </span>
                        </div>
                        <h1 className="text-5xl font-bold text-gray-900 sm:text-6xl md:text-7xl">
                            Manage Your Shopping{' '}
                            <span className="bg-gradient-to-r from-blue-600 to-blue-800 text-transparent bg-clip-text">
                                Smarter
                            </span>
                        </h1>
                        <p className="mt-6 max-w-md mx-auto text-lg text-gray-600 sm:max-w-xl">
                            Track expenses, create shopping lists, and analyze your spending habits all in one place.
                            Join thousands of satisfied users today.
                        </p>
                        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                            <Button className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700 transition-all transform hover:scale-105">
                                Get Started Free <ArrowRight className="ml-2" />
                            </Button>
                            <Button variant="outline" className="text-lg px-8 py-6 hover:bg-gray-50 transition-all">
                                Watch Demo
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-white border-y border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600">50K+</div>
                            <div className="text-gray-600">Active Users</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600">$2M+</div>
                            <div className="text-gray-600">Savings Tracked</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600">4.9/5</div>
                            <div className="text-gray-600">User Rating</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600">99%</div>
                            <div className="text-gray-600">Satisfaction</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section with hover effects */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                        Everything you need to manage shopping
                    </h2>
                    <p className="mt-4 text-lg text-gray-600">
                        Powerful features to make your shopping experience seamless
                    </p>
                </div>
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {[
                        {
                            icon: ListChecks,
                            title: "Smart Lists",
                            description: "Create and manage multiple shopping lists with smart categorization"
                        },
                        {
                            icon: TrendingUp,
                            title: "Expense Tracking",
                            description: "Monitor your spending patterns and stay within budget"
                        },
                        {
                            icon: Users,
                            title: "Family Sharing",
                            description: "Collaborate with family members seamlessly"
                        }
                    ].map((feature, index) => (
                        <Card
                            key={index}
                            className={`transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer ${hoveredCard === index ? 'border-blue-600' : ''
                                }`}
                            onMouseEnter={() => setHoveredCard(index)}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            <CardHeader>
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                    <feature.icon className="h-6 w-6 text-blue-600" />
                                </div>
                                <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                                <CardDescription className="text-gray-600">
                                    {feature.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button
                                    variant="ghost"
                                    className="mt-4 text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-0"
                                >
                                    Learn more <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* CTA Section with gradient */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                            Ready to simplify your shopping?
                        </h2>
                        <p className="mt-4 text-xl text-blue-100">
                            Join thousands of users who have transformed their shopping experience
                        </p>
                        <div className="mt-8 flex justify-center space-x-4">
                            <Button
                                variant="secondary"
                                size="lg"
                                className="bg-white text-blue-600 hover:bg-gray-100 transition-colors transform hover:scale-105"
                            >
                                Start Free Trial
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="text-white border-white hover:bg-blue-700 transition-colors"
                            >
                                Contact Sales
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;