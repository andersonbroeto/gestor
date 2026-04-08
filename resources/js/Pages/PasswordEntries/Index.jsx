import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function Index({ entries }) {
    const [showModal, setShowModal] = useState(false);
    const [editingEntry, setEditingEntry] = useState(null);
    const { data, setData, post, put, processing, reset, errors } = useForm({
        service: '',
        username: '',
        password: '',
    });

    const openModal = (entry = null) => {
        if (entry) {
            setEditingEntry(entry);
            setData({
                service: entry.service,
                username: entry.username,
                password: entry.password,
            });
        } else {
            setEditingEntry(null);
            reset();
        }
        setShowModal(true);
    };

    const submit = (e) => {
        e.preventDefault();

        if (editingEntry) {
            put(route('passwords.update', editingEntry.id), {
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                },
            });
        } else {
            post(route('passwords.store'), {
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                },
            });
        }
    };

    const deleteEntry = (id) => {
        if (confirm('Deseja excluir esta senha?')) {
            router.delete(route('passwords.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-2xl font-bold text-indigo-800">Senhas</h2>}
        >
            <Head title="Senhas" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    <div className="flex justify-end">
                        <PrimaryButton onClick={() => openModal()} className="btn-premium gradient-primary text-white border-none">
                            + Nova Senha
                        </PrimaryButton>
                    </div>

                    <div className="glass-card overflow-hidden p-6">
                        <div className="space-y-4">
                            {entries.length > 0 ? (
                                entries.map((entry) => (
                                    <div key={entry.id} className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4 w-full">
                                                <div>
                                                    <div className="text-[9px] uppercase tracking-widest text-gray-400">Serviço</div>
                                                    <div className="text-base font-semibold text-gray-900">{entry.service}</div>
                                                </div>
                                                <div>
                                                    <div className="text-[9px] uppercase tracking-widest text-gray-400">Usuário</div>
                                                    <div className="text-sm text-gray-800">{entry.username}</div>
                                                </div>
                                                <div>
                                                    <div className="text-[9px] uppercase tracking-widest text-gray-400">Senha</div>
                                                    <div className="text-sm font-medium text-gray-800 break-words">{entry.password}</div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => openModal(entry)}
                                                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4L16.5 3.5z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => deleteEntry(entry.id)}
                                                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                                    title="Excluir"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
                                    Nenhuma senha cadastrada ainda. Clique em + Nova Senha para adicionar.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <form onSubmit={submit} className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                        {editingEntry ? 'Editar Senha' : 'Nova Senha'}
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <InputLabel htmlFor="service" value="Serviço" />
                            <TextInput
                                id="service"
                                value={data.service}
                                onChange={(e) => setData('service', e.target.value)}
                                className="mt-1 block w-full"
                                required
                            />
                            {errors.service && <p className="mt-1 text-sm text-rose-600">{errors.service}</p>}
                        </div>

                        <div>
                            <InputLabel htmlFor="username" value="Usuário" />
                            <TextInput
                                id="username"
                                value={data.username}
                                onChange={(e) => setData('username', e.target.value)}
                                className="mt-1 block w-full"
                                required
                            />
                            {errors.username && <p className="mt-1 text-sm text-rose-600">{errors.username}</p>}
                        </div>

                        <div>
                            <InputLabel htmlFor="password" value="Senha" />
                            <TextInput
                                id="password"
                                type="text"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="mt-1 block w-full"
                                required
                            />
                            {errors.password && <p className="mt-1 text-sm text-rose-600">{errors.password}</p>}
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={() => setShowModal(false)}>Cancelar</SecondaryButton>
                        <PrimaryButton disabled={processing}>{editingEntry ? 'Atualizar' : 'Salvar'}</PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
