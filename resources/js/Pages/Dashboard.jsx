import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ stats }) {
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-2xl font-bold leading-tight text-indigo-800">
                    Visão Geral
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-8">
                    
                    {/* Financial Indicators */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Link href={route('finance.index', { type: 'receita' })} className="glass-card p-6 border-l-4 border-indigo-500 hover:scale-[1.02] transition-transform block">
                            <span className="stat-label">Total de Receitas</span>
                            <div className="stat-value text-indigo-600">{formatCurrency(stats.financial.revenue)}</div>
                        </Link>
                        
                        <Link href={route('finance.index', { type: 'despesa' })} className="glass-card p-6 border-l-4 border-rose-500 hover:scale-[1.02] transition-transform block">
                            <span className="stat-label">Total de Despesas</span>
                            <div className="stat-value text-rose-600">{formatCurrency(stats.financial.expenses)}</div>
                        </Link>

                        <Link href={route('projects.index')} className="glass-card p-6 border-l-4 border-amber-500 hover:scale-[1.02] transition-transform block group">
                            <div className="flex justify-between items-start">
                                <span className="stat-label">Valor a Receber</span>
                                <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md font-bold group-hover:bg-amber-200 transition-colors">
                                    Orçado - Recebido
                                </span>
                            </div>
                            <div className="stat-value text-amber-600 mb-2">{formatCurrency(stats.financial.toReceive)}</div>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                <span className="font-semibold text-gray-500">{formatCurrency(stats.financial.totalBudget)}</span>
                                <span>—</span>
                                <span className="font-semibold text-gray-500">{formatCurrency(stats.financial.projReceived)}</span>
                            </div>
                        </Link>

                        <Link href={route('finance.index')} className="glass-card p-6 border-l-4 border-emerald-500 hover:scale-[1.02] transition-transform block">
                            <span className="stat-label">Lucro Líquido</span>
                            <div className="stat-value text-emerald-600">{formatCurrency(stats.financial.profit)}</div>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Tasks Grouped */}
                        <div className="lg:col-span-2 glass-card p-8">
                            <h3 className="text-lg font-bold mb-6 text-gray-800">Status das Tarefas</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex flex-col items-center">
                                    <span className="text-3xl font-black text-gray-400">{stats.tasks.iniciar}</span>
                                    <span className="text-xs font-bold uppercase text-gray-500">A Iniciar</span>
                                </div>
                                <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 flex flex-col items-center">
                                    <span className="text-3xl font-black text-blue-500">{stats.tasks.em_andamento}</span>
                                    <span className="text-xs font-bold uppercase text-blue-600">Em Andamento</span>
                                </div>
                                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex flex-col items-center">
                                    <span className="text-3xl font-black text-emerald-500">{stats.tasks.concluida}</span>
                                    <span className="text-xs font-bold uppercase text-emerald-600">Concluídas</span>
                                </div>
                            </div>
                        </div>

                        {/* MRR Card */}
                        <div className="glass-card p-8 gradient-primary text-white">
                            <h3 className="text-lg font-bold mb-2">Receita Recorrente (MRR)</h3>
                            <p className="text-sm opacity-80 mb-6">Projeção mensal baseada em hospedagens</p>
                            <div className="text-4xl font-black">
                                {formatCurrency(stats.financial.mrr)}
                            </div>
                            <div className="mt-8 pt-6 border-t border-white/20">
                                <div className="flex justify-between items-center text-sm">
                                    <span>Eficiência de Recorrência</span>
                                    <span className="font-bold">100%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
