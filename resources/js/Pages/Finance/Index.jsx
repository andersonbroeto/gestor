import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function Index({ transactions, clients, projects, filters, totals, pendingDetails }) {
    const [showModal, setShowModal] = useState(false);
    const [showPendingModal, setShowPendingModal] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);

    // Filtros Locais
    const [filterData, setFilterData] = useState({
        type: filters.type || 'todos',
        month: filters.month || '',
        year: filters.year || new Date().getFullYear(),
        project_id: filters.project_id || '',
        client_id: filters.client_id || '',
    });

    const deleteTransaction = (id) => {
        if (confirm('Deseja excluir este lançamento?')) {
            router.delete(route('finance.destroy', id));
        }
    };

    const applyFilters = () => {
        router.get(route('finance.index'), filterData, { preserveState: true });
    };

    const clearFilters = () => {
        const defaultFilters = { type: 'todos', month: '', year: new Date().getFullYear(), project_id: '', client_id: '' };
        setFilterData(defaultFilters);
        router.get(route('finance.index'), defaultFilters);
    };

    const { data, setData, post, put, processing, reset, errors } = useForm({
        client_id: '',
        project_id: '',
        type: 'receita',
        value: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
    });

    const openModal = (transaction = null) => {
        if (transaction) {
            setEditingTransaction(transaction);
            setData({
                client_id: transaction.client_id || '',
                project_id: transaction.project_id || '',
                type: transaction.type,
                value: transaction.value,
                date: transaction.date,
                description: transaction.description || '',
            });
        } else {
            setEditingTransaction(null);
            reset();
        }
        setShowModal(true);
    };

    const submit = (e) => {
        e.preventDefault();
        if (editingTransaction) {
            put(route('finance.update', editingTransaction.id), {
                onSuccess: () => { setShowModal(false); reset(); }
            });
        } else {
            post(route('finance.store'), {
                onSuccess: () => { setShowModal(false); reset(); }
            });
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-2xl font-bold text-indigo-800">Financeiro</h2>}
        >
            <Head title="Financeiro" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    
                    {totals && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
                            <div className="glass-card p-5 border-b-4 border-indigo-500 hover:scale-[1.02] transition-transform">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total de Receitas</p>
                                <p className="text-2xl font-black text-indigo-600">{formatCurrency(totals.revenue)}</p>
                            </div>
                            <div className="glass-card p-5 border-b-4 border-rose-500 hover:scale-[1.02] transition-transform">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total de Despesas</p>
                                <p className="text-2xl font-black text-rose-600">{formatCurrency(totals.expenses)}</p>
                            </div>
                            <div 
                                onClick={() => setShowPendingModal(true)}
                                className="glass-card p-5 border-b-4 border-amber-500 hover:scale-[1.02] transition-transform cursor-pointer group"
                            >
                                <div className="flex justify-between items-start">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Geral a Receber</p>
                                    <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md font-bold group-hover:bg-amber-200 transition-colors">
                                        Ver Lista →
                                    </span>
                                </div>
                                <p className="text-2xl font-black text-amber-600 mt-1">{formatCurrency(totals.toReceive)}</p>
                            </div>
                        </div>
                    )}
                    
                    {/* Barra de Filtros */}
                    <div className="glass-card p-4 mb-6 flex flex-wrap items-end gap-4">
                        <div className="flex-1 min-w-[150px]">
                            <InputLabel value="Tipo" />
                            <select 
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-sm"
                                value={filterData.type}
                                onChange={e => setFilterData({...filterData, type: e.target.value})}
                            >
                                <option value="todos">Todos os Lançamentos</option>
                                <option value="receita">Apenas Receitas</option>
                                <option value="despesa">Apenas Despesas</option>
                            </select>
                        </div>
                        <div className="flex-1 min-w-[150px]">
                            <InputLabel value="Mês" />
                            <select 
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-sm"
                                value={filterData.month}
                                onChange={e => setFilterData({...filterData, month: e.target.value})}
                            >
                                <option value="">Todos os Meses</option>
                                <option value="1">Janeiro</option>
                                <option value="2">Fevereiro</option>
                                <option value="3">Março</option>
                                <option value="4">Abril</option>
                                <option value="5">Maio</option>
                                <option value="6">Junho</option>
                                <option value="7">Julho</option>
                                <option value="8">Agosto</option>
                                <option value="9">Setembro</option>
                                <option value="10">Outubro</option>
                                <option value="11">Novembro</option>
                                <option value="12">Dezembro</option>
                            </select>
                        </div>
                        <div className="flex-1 min-w-[200px]">
                            <InputLabel value="Projeto" />
                            <select 
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-sm"
                                value={filterData.project_id}
                                onChange={e => setFilterData({...filterData, project_id: e.target.value})}
                            >
                                <option value="">Todos os Projetos</option>
                                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                        <div className="flex-1 min-w-[200px]">
                            <InputLabel value="Cliente" />
                            <select 
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-sm"
                                value={filterData.client_id}
                                onChange={e => setFilterData({...filterData, client_id: e.target.value})}
                            >
                                <option value="">Todos os Clientes</option>
                                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className="w-[100px]">
                            <InputLabel value="Ano" />
                            <TextInput 
                                type="number"
                                className="mt-1 block w-full text-sm"
                                value={filterData.year}
                                onChange={e => setFilterData({...filterData, year: e.target.value})}
                            />
                        </div>
                        <div className="flex gap-2">
                            <PrimaryButton onClick={applyFilters} className="bg-indigo-600 hover:bg-indigo-700">Filtrar</PrimaryButton>
                            <SecondaryButton onClick={clearFilters}>Limpar</SecondaryButton>
                        </div>
                        <div className="ml-auto">
                            <PrimaryButton onClick={() => openModal()} className="btn-premium gradient-primary text-white border-none">
                                + Novo Lançamento
                            </PrimaryButton>
                        </div>
                    </div>

                    <div className="glass-card overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Data</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Descrição</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tipo</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Valor</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 italic-none">
                                {transactions.map((t) => (
                                    <tr key={t.id} className="hover:bg-indigo-50/30 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(t.date).toLocaleDateString('pt-BR')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-semibold text-gray-900">{t.description || 'Lançamento'}</div>
                                            <div className="text-[10px] text-gray-400 uppercase font-bold">
                                                {t.project ? `Projeto: ${t.project.name}` : (t.client ? `Cliente: ${t.client.name}` : 'Geral')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-[10px] font-black uppercase rounded-full ${t.type === 'receita' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                                {t.type}
                                            </span>
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${t.type === 'receita' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                            {t.type === 'receita' ? '+' : '-'} {formatCurrency(t.value)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => openModal(t)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Editar">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4L16.5 3.5z" />
                                                    </svg>
                                                </button>
                                                <button onClick={() => deleteTransaction(t.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Excluir">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {transactions.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-10 text-center text-gray-500">Nenhum lançamento encontrado.</td>
                                    </tr>
                                )}
                            </tbody>
                            <tfoot className="bg-gray-50 font-black border-t-2 border-gray-200">
                                <tr>
                                    <td colSpan="3" className="px-6 py-4 text-right text-gray-400 uppercase text-[10px] tracking-widest">Resumo do Filtro:</td>
                                    <td className="px-6 py-4 text-sm">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex justify-between text-emerald-600">
                                                <span>Receitas:</span>
                                                <span>{formatCurrency(transactions.filter(t => t.type === 'receita').reduce((acc, t) => acc + Number(t.value), 0))}</span>
                                            </div>
                                            <div className="flex justify-between text-rose-500">
                                                <span>Despesas:</span>
                                                <span>-{formatCurrency(transactions.filter(t => t.type === 'despesa').reduce((acc, t) => acc + Number(t.value), 0))}</span>
                                            </div>
                                            <div className={`flex justify-between pt-1 border-t border-gray-200 text-base ${
                                                (transactions.filter(t => t.type === 'receita').reduce((acc, t) => acc + Number(t.value), 0) - 
                                                 transactions.filter(t => t.type === 'despesa').reduce((acc, t) => acc + Number(t.value), 0)) >= 0 
                                                 ? 'text-indigo-600' : 'text-rose-600'
                                            }`}>
                                                <span>SALDO:</span>
                                                <span>{formatCurrency(
                                                    transactions.filter(t => t.type === 'receita').reduce((acc, t) => acc + Number(t.value), 0) - 
                                                    transactions.filter(t => t.type === 'despesa').reduce((acc, t) => acc + Number(t.value), 0)
                                                )}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>

            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <form onSubmit={submit} className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                        {editingTransaction ? 'Editar Lançamento' : 'Novo Lançamento'}
                    </h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="type" value="Tipo" />
                                <select
                                    id="type"
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    required
                                >
                                    <option value="receita">Receita</option>
                                    <option value="despesa">Despesa</option>
                                </select>
                            </div>
                            <div>
                                <InputLabel htmlFor="value" value="Valor" />
                                <TextInput
                                    id="value"
                                    type="number"
                                    step="0.01"
                                    value={data.value}
                                    onChange={(e) => setData('value', e.target.value)}
                                    className="mt-1 block w-full"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <InputLabel htmlFor="date" value="Data" />
                            <TextInput
                                id="date"
                                type="date"
                                value={data.date}
                                onChange={(e) => setData('date', e.target.value)}
                                className="mt-1 block w-full"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="client_id" value="Cliente (Opcional)" />
                                <select
                                    id="client_id"
                                    value={data.client_id}
                                    onChange={(e) => setData('client_id', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                >
                                    <option value="">Nenhum</option>
                                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <InputLabel htmlFor="project_id" value="Projeto (Opcional)" />
                                <select
                                    id="project_id"
                                    value={data.project_id}
                                    onChange={(e) => setData('project_id', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                >
                                    <option value="">Nenhum</option>
                                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                            </div>
                        </div>
                        <div>
                            <InputLabel htmlFor="description" value="Descrição" />
                            <TextInput
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="mt-1 block w-full"
                            />
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={() => setShowModal(false)}>Cancelar</SecondaryButton>
                        <PrimaryButton disabled={processing}>Salvar</PrimaryButton>
                    </div>
                </form>
            </Modal>

            <Modal show={showPendingModal} onClose={() => setShowPendingModal(false)} maxWidth="2xl">
                <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">
                        Detalhamento do Saldo a Receber
                    </h3>
                    
                    <div className="space-y-6 max-h-[60vh] overflow-y-auto">
                        {/* Projetos */}
                        {pendingDetails?.projects?.length > 0 && (
                            <div>
                                <h4 className="text-sm font-bold text-indigo-700 mb-3 bg-indigo-50 px-3 py-1 rounded w-fit">
                                    Projetos Pendentes
                                </h4>
                                <div className="space-y-3">
                                    {pendingDetails.projects.map(project => (
                                        <div key={`proj-${project.id}`} className="flex justify-between items-center p-3 border rounded-xl hover:bg-gray-50">
                                            <div>
                                                <p className="font-bold text-gray-800">{project.name}</p>
                                                <p className="text-xs text-gray-500">{project.client?.name || 'Sem cliente'}</p>
                                            </div>
                                            <p className="font-black text-amber-600">{formatCurrency(project.pending_value)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {(!pendingDetails?.projects?.length) && (
                            <p className="text-gray-500 text-center py-6">Não há saldos pendentes a receber.</p>
                        )}
                    </div>

                    <div className="mt-8 flex justify-end">
                        <SecondaryButton onClick={() => setShowPendingModal(false)}>Fechar</SecondaryButton>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
