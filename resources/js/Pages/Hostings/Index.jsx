import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import React, { useState } from 'react';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function Index({ hostings, clients, filters }) {
    const [showModal, setShowModal] = useState(false);
    const [editingHosting, setEditingHosting] = useState(null);
    const [expanded, setExpanded] = useState({});

    const toggleExpand = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

    // Filtros Locais
    const [filterData, setFilterData] = useState({
        client_id: filters.client_id || '',
        plan: filters.plan || 'todos',
        date: filters.date || '',
    });

    const deleteHosting = (id) => {
        if (confirm('Deseja excluir esta hospedagem?')) {
            router.delete(route('hostings.destroy', id));
        }
    };

    const applyFilters = () => {
        router.get(route('hostings.index'), filterData, { preserveState: true });
    };

    const clearFilters = () => {
        const defaultFilters = { client_id: '', plan: 'todos', date: '' };
        setFilterData(defaultFilters);
        router.get(route('hostings.index'), defaultFilters);
    };

    const { data, setData, post, put, processing, reset, errors } = useForm({
        client_id: '',
        plan: 'mensal',
        value: '',
        start_date: '',
        installments: 12,
    });

    const openModal = (hosting = null) => {
        if (hosting) {
            setEditingHosting(hosting);
            setData({
                client_id: hosting.client_id,
                plan: hosting.plan,
                value: hosting.value,
                start_date: hosting.start_date,
            });
        } else {
            setEditingHosting(null);
            reset();
        }
        setShowModal(true);
    };

    const submit = (e) => {
        e.preventDefault();
        if (editingHosting) {
            put(route('hostings.update', editingHosting.id), {
                onSuccess: () => { setShowModal(false); reset(); }
            });
        } else {
            post(route('hostings.store'), {
                onSuccess: () => { setShowModal(false); reset(); }
            });
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-2xl font-bold text-indigo-800">Hospedagens</h2>}
        >
            <Head title="Hospedagens" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    
                    {/* Barra de Filtros */}
                    <div className="glass-card p-4 mb-6 flex flex-wrap items-end gap-4">
                        <div className="flex-2 min-w-[200px]">
                            <InputLabel value="Filtrar por Cliente" />
                            <select 
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-sm"
                                value={filterData.client_id}
                                onChange={e => setFilterData({...filterData, client_id: e.target.value})}
                            >
                                <option value="">Todos os Clientes</option>
                                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className="flex-1 min-w-[150px]">
                            <InputLabel value="Plano" />
                            <select 
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-sm"
                                value={filterData.plan}
                                onChange={e => setFilterData({...filterData, plan: e.target.value})}
                            >
                                <option value="todos">Todos os Planos</option>
                                <option value="mensal">Mensal</option>
                                <option value="semestral">Semestral</option>
                                <option value="anual">Anual</option>
                            </select>
                        </div>
                        <div className="flex-1 min-w-[150px]">
                            <InputLabel value="Início a partir de" />
                            <TextInput 
                                type="date"
                                className="mt-1 block w-full text-sm"
                                value={filterData.date}
                                onChange={e => setFilterData({...filterData, date: e.target.value})}
                            />
                        </div>
                        <div className="flex gap-2">
                            <PrimaryButton onClick={applyFilters} className="bg-indigo-600 hover:bg-indigo-700">Filtrar</PrimaryButton>
                            <SecondaryButton onClick={clearFilters}>Limpar</SecondaryButton>
                        </div>
                        <div className="ml-auto">
                            <PrimaryButton onClick={() => openModal()} className="btn-premium gradient-primary text-white border-none">
                                + Nova Hospedagem
                            </PrimaryButton>
                        </div>
                    </div>

                    <div className="glass-card overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Cliente</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Plano</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Valor</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Início</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {hostings.map((hosting) => (
                                    <React.Fragment key={hosting.id}>
                                        <tr className="hover:bg-indigo-50/30 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 cursor-pointer" onClick={() => toggleExpand(hosting.id)}>
                                                <div className="flex items-center gap-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-indigo-500 transition-transform ${expanded[hosting.id] ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                    {hosting.client?.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">
                                                {hosting.plan}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-indigo-600">
                                                {formatCurrency(hosting.value)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(hosting.start_date).toLocaleDateString('pt-BR', {timeZone:'UTC'})}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => openModal(hosting)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Editar">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4L16.5 3.5z" />
                                                        </svg>
                                                    </button>
                                                    <button onClick={() => deleteHosting(hosting.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Excluir">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        {expanded[hosting.id] && hosting.payments && hosting.payments.length > 0 && (
                                            <tr className="bg-gray-50/50">
                                                <td colSpan="5" className="px-8 py-6">
                                                    <h4 className="text-sm font-bold text-gray-700 mb-3">Lançamentos Gerados</h4>
                                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                                        {hosting.payments.map((payment, idx) => (
                                                            <button
                                                                key={payment.id}
                                                                onClick={() => router.patch(route('hosting_payments.toggle', payment.id), {}, { preserveScroll: true })}
                                                                className={`p-3 rounded-xl border text-left transition-all ${payment.is_paid ? 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100' : 'bg-white border-amber-200 hover:bg-amber-50 shadow-sm'}`}
                                                            >
                                                                <p className={`text-xs font-bold mb-1 ${payment.is_paid ? 'text-emerald-700' : 'text-amber-600'}`}>
                                                                    {payment.is_paid ? 'PAGO' : 'PENDENTE'}
                                                                </p>
                                                                <p className="text-[10px] text-gray-500 font-semibold">{idx+1}º Mês</p>
                                                                <p className="text-xs font-black text-gray-900 mt-1">
                                                                    {new Date(payment.due_date).toLocaleDateString('pt-BR', {timeZone:'UTC'})}
                                                                </p>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                                {hostings.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-10 text-center text-gray-500">Nenhuma hospedagem cadastrada.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <form onSubmit={submit} className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                        {editingHosting ? 'Editar Hospedagem' : 'Nova Hospedagem'}
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <InputLabel htmlFor="client_id" value="Cliente" />
                            <select
                                id="client_id"
                                value={data.client_id}
                                onChange={(e) => setData('client_id', e.target.value)}
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                required
                            >
                                <option value="">Selecione um cliente</option>
                                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="plan" value="Plano" />
                                <select
                                    id="plan"
                                    value={data.plan}
                                    onChange={(e) => setData('plan', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    required
                                >
                                    <option value="mensal">Mensal</option>
                                    <option value="semestral">Semestral</option>
                                    <option value="anual">Anual</option>
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
                            <InputLabel htmlFor="start_date" value="Data de Início" />
                            <TextInput
                                id="start_date"
                                type="date"
                                value={data.start_date}
                                onChange={(e) => setData('start_date', e.target.value)}
                                className="mt-1 block w-full"
                                required
                            />
                        </div>
                        {!editingHosting && (
                            <div>
                                <InputLabel htmlFor="installments" value="Lançamentos a Gerar (Meses)" />
                                <TextInput
                                    id="installments"
                                    type="number"
                                    min="1"
                                    value={data.installments}
                                    onChange={(e) => setData('installments', e.target.value)}
                                    className="mt-1 block w-full"
                                    required
                                />
                                <p className="text-xs text-gray-400 mt-1">Gerará pagamentos pendentes automaticamente.</p>
                            </div>
                        )}
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
