import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function Index({ clients }) {
    const [showModal, setShowModal] = useState(false);
    const [editingClient, setEditingClient] = useState(null);

    const { data, setData, post, put, processing, reset, errors } = useForm({
        name: '',
        email: '',
        whatsapp: '',
    });

    const openModal = (client = null) => {
        if (client) {
            setEditingClient(client);
            setData({
                name: client.name,
                email: client.email || '',
                whatsapp: client.whatsapp || '',
            });
        } else {
            setEditingClient(null);
            reset();
        }
        setShowModal(true);
    };

    const deleteClient = (id) => {
        if (confirm('Tem certeza que deseja excluir este cliente?')) {
            router.delete(route('clients.destroy', id));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        if (editingClient) {
            put(route('clients.update', editingClient.id), {
                onSuccess: () => { setShowModal(false); reset(); }
            });
        } else {
            post(route('clients.store'), {
                onSuccess: () => { setShowModal(false); reset(); }
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-2xl font-bold text-indigo-800">Clientes</h2>}
        >
            <Head title="Clientes" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex justify-end mb-6">
                        <PrimaryButton onClick={() => openModal()} className="btn-premium gradient-primary text-white border-none">
                            + Novo Cliente
                        </PrimaryButton>
                    </div>

                    <div className="glass-card overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nome</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Contato</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Projetos</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 italic-none">
                                {clients.map((client) => (
                                    <tr key={client.id} className="hover:bg-indigo-50/30 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-semibold text-gray-900">{client.name}</div>
                                            <div className="text-xs text-gray-500">{client.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {client.whatsapp || '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-2">
                                                <span className="px-2 py-1 text-[10px] font-black uppercase rounded-full bg-indigo-100 text-indigo-700 w-fit">
                                                    {client.projects_count} projetos
                                                </span>
                                                <div className="flex flex-wrap gap-1">
                                                    {client.projects?.map(project => (
                                                        <Link
                                                            key={project.id}
                                                            href={route('projects.show', project.id)}
                                                            className="text-[10px] bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-800 px-2 py-0.5 rounded border border-indigo-200 transition-colors font-semibold"
                                                            title={`Ver projeto: ${project.name}`}
                                                        >
                                                            {project.name} →
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => openModal(client)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Editar">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4L16.5 3.5z" />
                                                    </svg>
                                                </button>
                                                <button onClick={() => deleteClient(client.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Excluir">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {clients.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-10 text-center text-gray-500">Nenhum cliente cadastrado.</td>
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
                        {editingClient ? 'Editar Cliente' : 'Novo Cliente'}
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <InputLabel htmlFor="name" value="Nome Completo" />
                            <TextInput
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="mt-1 block w-full"
                                required
                            />
                        </div>
                        <div>
                            <InputLabel htmlFor="email" value="E-mail" />
                            <TextInput
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="mt-1 block w-full"
                            />
                        </div>
                        <div>
                            <InputLabel htmlFor="whatsapp" value="WhatsApp" />
                            <TextInput
                                id="whatsapp"
                                value={data.whatsapp}
                                onChange={(e) => setData('whatsapp', e.target.value)}
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
        </AuthenticatedLayout>
    );
}
