import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function Index({ projects, clients, totals }) {
    const [showModal, setShowModal] = useState(false);

    const { data, setData, post, processing, reset } = useForm({
        client_id: '',
        name: '',
        budget: '',
        status: 'orcamento',
    });

    const openModal = () => {
        reset();
        setShowModal(true);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('projects.store'), {
            onSuccess: () => { setShowModal(false); reset(); }
        });
    };

    const formatCurrency = (value) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseFloat(value) || 0);

    const statusConfig = {
        orcamento:    { label: 'Orçamento',    cls: 'bg-amber-100 text-amber-700 border-amber-200' },
        em_andamento: { label: 'Em Andamento', cls: 'bg-blue-100 text-blue-700 border-blue-200' },
        concluido:    { label: 'Concluído',    cls: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-2xl font-bold text-indigo-800">Projetos</h2>}>
            <Head title="Projetos" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">

                    {/* Resumo Financeiro Geral */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="glass-card p-5 border-b-4 border-indigo-500">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Orçado</p>
                            <p className="text-2xl font-black text-indigo-900">{formatCurrency(totals.budget)}</p>
                        </div>
                        <div className="glass-card p-5 border-b-4 border-emerald-500">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Já Recebido</p>
                            <p className="text-2xl font-black text-emerald-600">{formatCurrency(totals.received)}</p>
                        </div>
                        <div className="glass-card p-5 border-b-4 border-amber-500">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Saldo a Receber</p>
                            <p className="text-2xl font-black text-amber-600">{formatCurrency(totals.pending)}</p>
                        </div>
                    </div>

                    {/* Lista de Projetos */}
                    <div className="glass-card overflow-hidden">
                        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                            <h3 className="text-base font-bold text-gray-700">Todos os Projetos</h3>
                            <PrimaryButton onClick={() => openModal()} className="btn-premium gradient-primary text-white border-none text-sm">
                                + Novo Projeto
                            </PrimaryButton>
                        </div>

                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Projeto</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Cliente</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Orçado</th>
                                    <th className="px-6 py-3 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Recebido</th>
                                    <th className="px-6 py-3 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">A Receber</th>
                                    <th className="px-6 py-3 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Progresso</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {projects.map((project) => {
                                    const budget   = parseFloat(project.budget) || 0;
                                    const received = parseFloat(project.total_received) || 0;
                                    const pct = budget > 0 ? Math.min(100, (received / budget) * 100) : 0;
                                    const cfg = statusConfig[project.status] || statusConfig.orcamento;

                                    return (
                                        <tr
                                            key={project.id}
                                            onClick={() => router.visit(route('projects.show', project.id))}
                                            className={`hover:bg-indigo-50/60 transition-colors cursor-pointer ${project.status === 'concluido' ? 'opacity-70' : ''}`}
                                        >
                                            <td className="px-6 py-4">
                                                <span className="font-bold text-indigo-700">
                                                    {project.name}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{project.client?.name ?? '—'}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-[10px] font-black rounded-md border whitespace-nowrap ${cfg.cls}`}>
                                                    {cfg.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm font-bold text-gray-900">{formatCurrency(budget)}</td>
                                            <td className="px-6 py-4 text-right text-sm font-bold text-emerald-600">{formatCurrency(received)}</td>
                                            <td className="px-6 py-4 text-right text-sm font-bold text-amber-500">
                                                {formatCurrency(Math.max(0, budget - received))}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                        <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                                                    </div>
                                                    <span className="text-[10px] font-bold text-gray-400 w-8 text-right">{Math.round(pct)}%</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-300 group-hover:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {projects.length === 0 && (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-16 text-center text-gray-400">Nenhum projeto cadastrado.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal de Projeto */}
            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <form onSubmit={submit} className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                        Novo Projeto
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <InputLabel htmlFor="client_id" value="Cliente" />
                            <select id="client_id" value={data.client_id} onChange={(e) => setData('client_id', e.target.value)}
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm" required>
                                <option value="">Selecione um cliente</option>
                                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <InputLabel htmlFor="name" value="Nome do Projeto" />
                            <TextInput id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} className="mt-1 block w-full" required />
                        </div>
                        <div>
                            <InputLabel htmlFor="budget" value="Valor Orçado" />
                            <TextInput id="budget" type="number" step="0.01" value={data.budget} onChange={(e) => setData('budget', e.target.value)} className="mt-1 block w-full" required />
                        </div>
                        <div>
                            <InputLabel htmlFor="status" value="Status" />
                            <select id="status" value={data.status} onChange={(e) => setData('status', e.target.value)}
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm" required>
                                <option value="orcamento">Orçamento</option>
                                <option value="em_andamento">Em Andamento</option>
                                <option value="concluido">Concluído</option>
                            </select>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={() => setShowModal(false)}>Cancelar</SecondaryButton>
                        <PrimaryButton disabled={processing}>Salvar</PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
