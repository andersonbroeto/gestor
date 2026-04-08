import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function Show({ project, transactions, tasks, clients }) {

    const [showFinanceModal, setShowFinanceModal] = useState(false);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showEditTransactionModal, setShowEditTransactionModal] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);

    const transactionEditForm = useForm({
        project_id: project.id,
        client_id: project.client_id || '',
        type: 'receita',
        value: '',
        date: '',
        description: '',
    });

    const openEditTransaction = (t) => {
        setEditingTransaction(t);
        transactionEditForm.setData({
            project_id: project.id,
            client_id: project.client_id || '',
            type: t.type,
            value: t.value,
            date: t.date ? t.date.substring(0, 10) : '',
            description: t.description || '',
        });
        setShowEditTransactionModal(true);
    };

    const submitEditTransaction = (e) => {
        e.preventDefault();
        transactionEditForm.put(route('finance.update', editingTransaction.id), {
            onSuccess: () => { setShowEditTransactionModal(false); setEditingTransaction(null); }
        });
    };

    const deleteTransaction = (id) => {
        if (confirm('Excluir este lançamento?')) {
            router.delete(route('finance.destroy', id), { preserveScroll: true });
        }
    };

    const editForm = useForm({
        client_id: project.client_id || '',
        name: project.name,
        budget: project.budget,
        status: project.status,
    });

    const submitEdit = (e) => {
        e.preventDefault();
        editForm.put(route('projects.update', project.id), {
            onSuccess: () => setShowEditModal(false)
        });
    };

    const deleteProject = () => {
        if (confirm(`Excluir o projeto "${project.name}"? Esta ação não pode ser desfeita.`)) {
            router.delete(route('projects.destroy', project.id));
        }
    };

    const taskForm = useForm({
        project_id: project.id,
        client_id: project.client_id || '',
        title: '',
        description: '',
        status: 'iniciar',
    });

    const submitTask = (e) => {
        e.preventDefault();
        taskForm.post(route('tasks.store'), {
            onSuccess: () => { setShowTaskModal(false); taskForm.reset('title', 'description'); }
        });
    };

    const changeStatus = (newStatus) => {
        router.patch(route('projects.update', project.id), {
            name: project.name,
            client_id: project.client_id,
            budget: project.budget,
            status: newStatus,
        }, { preserveScroll: true });
    };

    const financeForm = useForm({
        project_id: project.id,
        client_id: project.client_id || '',
        type: 'receita',
        value: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
    });

    const submitFinance = (e) => {
        e.preventDefault();
        financeForm.post(route('finance.store'), {
            onSuccess: () => { setShowFinanceModal(false); financeForm.reset('value', 'description'); }
        });
    };

    const formatCurrency = (value) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseFloat(value) || 0);

    const formatDate = (d) => d ? new Date(d).toLocaleDateString('pt-BR') : '—';

    const budget   = parseFloat(project.budget) || 0;
    const received = parseFloat(project.total_received) || 0;
    const costs    = parseFloat(project.total_costs) || 0;
    const receivedPct = budget > 0 ? Math.min(100, (received / budget) * 100) : 0;
    const costsPct    = budget > 0 ? Math.min(100 - receivedPct, (costs / budget) * 100) : 0;
    const remaining   = Math.max(0, budget - received);
    const profit      = parseFloat(project.projected_profit) || 0;

    const statusConfig = {
        orcamento:    { label: 'Orçamento',    cls: 'bg-amber-100 text-amber-700 border-amber-200' },
        em_andamento: { label: 'Em Andamento', cls: 'bg-blue-100 text-blue-700 border-blue-200' },
        concluido:    { label: 'Concluído',    cls: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    };

    const taskStatus = {
        iniciar:      { label: 'A Iniciar',    cls: 'bg-gray-100 text-gray-600 border-gray-200' },
        em_andamento: { label: 'Em Andamento', cls: 'bg-blue-100 text-blue-700 border-blue-200' },
        concluida:    { label: 'Concluída',    cls: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    };

    const cfg = statusConfig[project.status] || statusConfig.orcamento;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Link href={route('projects.index')} className="text-indigo-400 hover:text-indigo-600 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold text-indigo-800 leading-none">{project.name}</h2>
                        <p className="text-sm text-gray-500 mt-0.5">{project.client?.name}</p>
                    </div>
                    {/* Status como select inline estilizado */}
                    <select
                        value={project.status}
                        onChange={(e) => changeStatus(e.target.value)}
                        className={`ml-2 shrink-0 whitespace-nowrap pl-3 pr-8 py-1.5 text-xs font-bold rounded-lg border-2 cursor-pointer focus:ring-2 focus:outline-none transition-colors ${
                            project.status === 'orcamento'    ? 'bg-amber-100 text-amber-700 border-amber-200 focus:ring-amber-500' :
                            project.status === 'em_andamento' ? 'bg-blue-100 text-blue-700 border-blue-200 focus:ring-blue-500' :
                                                                'bg-emerald-100 text-emerald-700 border-emerald-200 focus:ring-emerald-500'
                        }`}
                    >
                        <option value="orcamento">Orçamento</option>
                        <option value="em_andamento">Em Andamento</option>
                        <option value="concluido">Concluído</option>
                    </select>

                    {/* Ações do Projeto */}
                    <div className="ml-auto flex items-center gap-2">
                        <button onClick={() => setShowEditModal(true)} className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors" title="Editar Projeto">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4L16.5 3.5z" />
                            </svg>
                        </button>
                        <button onClick={deleteProject} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors" title="Excluir Projeto">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            }
        >
            <Head title={`Projeto: ${project.name}`} />

            <div className="py-10">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-8">

                    {/* Cards Financeiros */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="glass-card p-5 border-l-4 border-indigo-500">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Valor Orçado</p>
                            <p className="text-xl font-black text-indigo-900">{formatCurrency(budget)}</p>
                        </div>
                        <div className="glass-card p-5 border-l-4 border-emerald-500">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Já Recebido</p>
                            <p className="text-xl font-black text-emerald-600">{formatCurrency(received)}</p>
                        </div>
                        <div className="glass-card p-5 border-l-4 border-amber-500">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">A Receber</p>
                            <p className="text-xl font-black text-amber-600">{formatCurrency(remaining)}</p>
                        </div>
                        <div className={`glass-card p-5 border-l-4 ${profit >= 0 ? 'border-indigo-400' : 'border-rose-500'}`}>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Lucro Proj.</p>
                            <p className={`text-xl font-black ${profit >= 0 ? 'text-indigo-600' : 'text-rose-600'}`}>{formatCurrency(profit)}</p>
                        </div>
                    </div>

                    {/* Gráfico de distribuição */}
                    <div className="glass-card p-6">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-sm font-bold text-gray-600 uppercase tracking-widest">Distribuição do Orçamento</h3>
                            <button
                                onClick={() => setShowFinanceModal(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Lançar Financeiro
                            </button>
                        </div>
                        
                        {/* 3 barras independentes — cada uma como % do orçamento */}
                        {(() => {
                            const ref = budget > 0 ? budget : 1;
                            const bars = [
                                { label: 'Recebido',  value: received, pct: Math.min(100, (received / ref) * 100), barCls: 'bg-emerald-500', textCls: 'text-emerald-600' },
                                { label: 'Custos',    value: costs,    pct: Math.min(100, (costs    / ref) * 100), barCls: 'bg-rose-400',    textCls: 'text-rose-500'   },
                            ];
                            if (remaining > 0) {
                                bars.push({ label: 'A Receber', value: remaining,pct: Math.min(100, (remaining/ ref) * 100), barCls: 'bg-amber-400',   textCls: 'text-amber-500'  });
                            }
                            return (
                                <div className="space-y-3 mb-2">
                                    {bars.map(bar => (
                                        <div key={bar.label}>
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-xs font-semibold text-gray-500">{bar.label}</span>
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-xs font-black ${bar.textCls}`}>{formatCurrency(bar.value)}</span>
                                                    <span className="text-[10px] text-gray-400 w-8 text-right">{Math.round(bar.pct)}%</span>
                                                </div>
                                            </div>
                                            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                                                <div
                                                    className={`h-full ${bar.barCls} rounded-full transition-all duration-700`}
                                                    style={{ width: `${bar.pct}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            );
                        })()}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Tarefas */}
                        <div className="glass-card overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="font-bold text-gray-700">Tarefas do Projeto</h3>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-bold text-gray-400">{tasks.length} tarefa{tasks.length !== 1 ? 's' : ''}</span>
                                    <button
                                        onClick={() => setShowTaskModal(true)}
                                        className="flex items-center gap-1 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Nova Tarefa
                                    </button>
                                </div>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {tasks.map(task => {
                                    const tc = taskStatus[task.status] || taskStatus.iniciar;
                                    return (
                                        <div key={task.id} className="px-6 py-3 flex items-center justify-between gap-3">
                                            <p className={`text-sm font-semibold ${task.status === 'concluida' ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                                                {task.title}
                                            </p>
                                            <span className={`shrink-0 whitespace-nowrap px-2 py-0.5 text-[10px] font-black rounded-md border ${tc.cls}`}>{tc.label}</span>
                                        </div>
                                    );
                                })}
                                {tasks.length === 0 && (
                                    <div className="px-6 py-10 text-center text-gray-400 text-sm">Nenhuma tarefa vinculada.</div>
                                )}
                            </div>
                        </div>

                        {/* Lançamentos */}
                        <div className="glass-card overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="font-bold text-gray-700">Lançamentos Financeiros</h3>
                                <span className="text-xs font-bold text-gray-400">{transactions.length} lançamento{transactions.length !== 1 ? 's' : ''}</span>
                            </div>
                            <div className="divide-y divide-gray-50 max-h-96 overflow-y-auto">
                                {transactions.map(t => (
                                    <div key={t.id} className="px-6 py-3 flex items-center justify-between gap-3 group hover:bg-gray-50/60 transition-colors">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-800 truncate">{t.description || '—'}</p>
                                            <p className="text-[10px] text-gray-400">{formatDate(t.date)}</p>
                                        </div>
                                        <span className={`text-sm font-black shrink-0 ${t.type === 'receita' ? 'text-emerald-600' : 'text-rose-500'}`}>
                                            {t.type === 'receita' ? '+' : '−'}{formatCurrency(t.value)}
                                        </span>
                                        <div className="flex items-center gap-1 shrink-0">
                                            <button onClick={() => openEditTransaction(t)} className="p-1.5 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors" title="Editar">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4L16.5 3.5z" />
                                                </svg>
                                            </button>
                                            <button onClick={() => deleteTransaction(t.id)} className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors" title="Excluir">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {transactions.length === 0 && (
                                    <div className="px-6 py-10 text-center text-gray-400 text-sm">Nenhum lançamento neste projeto.</div>
                                )}
                            </div>
                            {transactions.length > 0 && (
                                <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-between text-xs font-bold">
                                    <div className="flex gap-4">
                                        <span className="text-emerald-600">Receitas: {formatCurrency(transactions.filter(t=>t.type==='receita').reduce((a,t)=>a+parseFloat(t.value),0))}</span>
                                        <span className="text-rose-500">Custos: {formatCurrency(transactions.filter(t=>t.type==='despesa').reduce((a,t)=>a+parseFloat(t.value),0))}</span>
                                    </div>
                                    <span className={`${profit >= 0 ? 'text-indigo-600' : 'text-rose-600'}`}>Saldo: {formatCurrency(received - costs)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Editar Lançamento */}
            <Modal show={showEditTransactionModal} onClose={() => setShowEditTransactionModal(false)}>
                <form onSubmit={submitEditTransaction} className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Editar Lançamento</h3>
                    <p className="text-sm text-gray-400 mb-4">Projeto: <strong>{project.name}</strong></p>
                    <div className="space-y-4">
                        <div>
                            <InputLabel value="Tipo de Lançamento" />
                            <div className="flex gap-4 mt-2">
                                {[['receita','Pagamento (Receita)','text-emerald-600'],['despesa','Custo (Despesa)','text-rose-500']].map(([val,label,cls]) => (
                                    <label key={val} className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="edit_type" value={val}
                                            checked={transactionEditForm.data.type === val}
                                            onChange={() => transactionEditForm.setData('type', val)} />
                                        <span className={`text-sm font-bold ${cls}`}>{label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="et_value" value="Valor (R$)" />
                                <TextInput id="et_value" type="number" step="0.01" value={transactionEditForm.data.value}
                                    onChange={(e) => transactionEditForm.setData('value', e.target.value)} className="mt-1 block w-full" required />
                            </div>
                            <div>
                                <InputLabel htmlFor="et_date" value="Data" />
                                <TextInput id="et_date" type="date" value={transactionEditForm.data.date}
                                    onChange={(e) => transactionEditForm.setData('date', e.target.value)} className="mt-1 block w-full" required />
                            </div>
                        </div>
                        <div>
                            <InputLabel htmlFor="et_desc" value="Descrição" />
                            <TextInput id="et_desc" value={transactionEditForm.data.description}
                                onChange={(e) => transactionEditForm.setData('description', e.target.value)} className="mt-1 block w-full" required />
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={() => setShowEditTransactionModal(false)}>Cancelar</SecondaryButton>
                        <PrimaryButton disabled={transactionEditForm.processing} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                            Salvar Alterações
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* Modal Lançamento Financeiro */}
            <Modal show={showFinanceModal} onClose={() => setShowFinanceModal(false)}>
                <form onSubmit={submitFinance} className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Novo Lançamento</h3>
                    <p className="text-sm text-gray-400 mb-4">Projeto: <strong>{project.name}</strong></p>
                    <div className="space-y-4">
                        <div>
                            <InputLabel value="Tipo de Lançamento" />
                            <div className="flex gap-4 mt-2">
                                {[['receita','Pagamento (Receita)','text-emerald-600'],['despesa','Custo (Despesa)','text-rose-500']].map(([val,label,cls]) => (
                                    <label key={val} className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="type" value={val}
                                            checked={financeForm.data.type === val}
                                            onChange={() => financeForm.setData('type', val)} />
                                        <span className={`text-sm font-bold ${cls}`}>{label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="f_value" value="Valor (R$)" />
                                <TextInput id="f_value" type="number" step="0.01" value={financeForm.data.value}
                                    onChange={(e) => financeForm.setData('value', e.target.value)} className="mt-1 block w-full" required />
                            </div>
                            <div>
                                <InputLabel htmlFor="f_date" value="Data" />
                                <TextInput id="f_date" type="date" value={financeForm.data.date}
                                    onChange={(e) => financeForm.setData('date', e.target.value)} className="mt-1 block w-full" required />
                            </div>
                        </div>
                        <div>
                            <InputLabel htmlFor="f_desc" value="Descrição" />
                            <TextInput id="f_desc" value={financeForm.data.description}
                                onChange={(e) => financeForm.setData('description', e.target.value)} className="mt-1 block w-full" required />
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={() => setShowFinanceModal(false)}>Cancelar</SecondaryButton>
                        <PrimaryButton disabled={financeForm.processing} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                            Confirmar Lançamento
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
            {/* Modal Nova Tarefa */}
            <Modal show={showTaskModal} onClose={() => setShowTaskModal(false)}>
                <form onSubmit={submitTask} className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Nova Tarefa</h3>
                    <p className="text-sm text-gray-400 mb-4">Projeto: <strong>{project.name}</strong></p>
                    <div className="space-y-4">
                        <div>
                            <InputLabel htmlFor="t_title" value="Título da Tarefa" />
                            <TextInput id="t_title" value={taskForm.data.title}
                                onChange={(e) => taskForm.setData('title', e.target.value)}
                                className="mt-1 block w-full" placeholder="Ex: Implementar tela de login" required />
                        </div>
                        <div>
                            <InputLabel htmlFor="t_status" value="Status" />
                            <select id="t_status" value={taskForm.data.status}
                                onChange={(e) => taskForm.setData('status', e.target.value)}
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm">
                                <option value="iniciar">A Iniciar</option>
                                <option value="em_andamento">Em Andamento</option>
                                <option value="concluida">Concluída</option>
                            </select>
                        </div>
                        <div>
                            <InputLabel htmlFor="t_desc" value="Descrição (opcional)" />
                            <textarea id="t_desc" value={taskForm.data.description}
                                onChange={(e) => taskForm.setData('description', e.target.value)}
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                rows="3" placeholder="Detalhes da tarefa..." />
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={() => setShowTaskModal(false)}>Cancelar</SecondaryButton>
                        <PrimaryButton disabled={taskForm.processing} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                            Salvar Tarefa
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* Modal Editar Projeto */}
            <Modal show={showEditModal} onClose={() => setShowEditModal(false)}>
                <form onSubmit={submitEdit} className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Editar Projeto</h3>
                    <div className="space-y-4">
                        <div>
                            <InputLabel htmlFor="e_name" value="Nome do Projeto" />
                            <TextInput id="e_name" value={editForm.data.name}
                                onChange={(e) => editForm.setData('name', e.target.value)}
                                className="mt-1 block w-full" required />
                        </div>
                        <div>
                            <InputLabel htmlFor="e_budget" value="Valor Orçado" />
                            <TextInput id="e_budget" type="number" step="0.01" value={editForm.data.budget}
                                onChange={(e) => editForm.setData('budget', e.target.value)}
                                className="mt-1 block w-full" required />
                        </div>
                        <div>
                            <InputLabel htmlFor="e_status" value="Status" />
                            <select id="e_status" value={editForm.data.status}
                                onChange={(e) => editForm.setData('status', e.target.value)}
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm">
                                <option value="orcamento">Orçamento</option>
                                <option value="em_andamento">Em Andamento</option>
                                <option value="concluido">Concluído</option>
                            </select>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={() => setShowEditModal(false)}>Cancelar</SecondaryButton>
                        <PrimaryButton disabled={editForm.processing} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                            Salvar Alterações
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

        </AuthenticatedLayout>
    );
}
