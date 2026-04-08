import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function Index({ tasks, clients, projects }) {
    const [showModal, setShowModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    const { data, setData, post, put, processing, reset, errors } = useForm({
        client_id: '',
        project_id: '',
        title: '',
        description: '',
        status: 'iniciar',
    });

    const openModal = (task = null) => {
        if (task) {
            setEditingTask(task);
            setData({
                client_id: task.client_id || '',
                project_id: task.project_id || '',
                title: task.title,
                description: task.description || '',
                status: task.status,
            });
        } else {
            setEditingTask(null);
            reset();
        }
        setShowModal(true);
    };

    const deleteTask = (id) => {
        if (confirm('Deseja excluir esta tarefa?')) {
            router.delete(route('tasks.destroy', id));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        if (editingTask) {
            put(route('tasks.update', editingTask.id), {
                onSuccess: () => { setShowModal(false); reset(); }
            });
        } else {
            post(route('tasks.store'), {
                onSuccess: () => { setShowModal(false); reset(); }
            });
        }
    };

    const statusBadge = (status) => {
        const styles = {
            iniciar: 'bg-gray-100 text-gray-700 border-gray-200',
            em_andamento: 'bg-blue-100 text-blue-700 border-blue-200',
            concluida: 'bg-emerald-100 text-emerald-700 border-emerald-200'
        };
        const labels = {
            iniciar: 'A Iniciar',
            em_andamento: 'Em Andamento',
            concluida: 'Concluída'
        };
        return <span className={`px-3 py-1 text-xs font-bold rounded-full border ${styles[status]}`}>{labels[status]}</span>;
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-2xl font-bold text-indigo-800">Tarefas</h2>}
        >
            <Head title="Tarefas" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex justify-end mb-6">
                        <PrimaryButton onClick={() => openModal()} className="btn-premium gradient-primary text-white border-none">
                            + Nova Tarefa
                        </PrimaryButton>
                    </div>

                    <div className="space-y-4">
                        {tasks.map((task) => (
                            <div key={task.id} className="glass-card p-5 flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <div className="flex flex-col items-center justify-center min-w-[120px]">
                                        {statusBadge(task.status)}
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-gray-900">{task.title}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            {task.project && <span className="text-[10px] font-bold uppercase py-0.5 px-2 bg-indigo-50 text-indigo-500 rounded">{task.project.name}</span>}
                                            {task.client && <span className="text-[10px] font-bold uppercase py-0.5 px-2 bg-gray-50 text-gray-500 rounded">{task.client.name}</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                     <button onClick={() => openModal(task)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4L16.5 3.5z" />
                                        </svg>
                                     </button>
                                     <button onClick={() => deleteTask(task.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                     </button>
                                </div>
                            </div>
                        ))}
                        {tasks.length === 0 && (
                            <div className="py-20 text-center text-gray-500 glass-card">Nenhuma tarefa cadastrada.</div>
                        )}
                    </div>
                </div>
            </div>

            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <form onSubmit={submit} className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                        {editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <InputLabel htmlFor="title" value="Título da Tarefa" />
                            <TextInput
                                id="title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
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
                            <InputLabel htmlFor="status" value="Status" />
                            <select
                                id="status"
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                required
                            >
                                <option value="iniciar">A Iniciar</option>
                                <option value="em_andamento">Em Andamento</option>
                                <option value="concluida">Concluída</option>
                            </select>
                        </div>
                        <div>
                            <InputLabel htmlFor="description" value="Descrição" />
                            <textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                rows="3"
                            ></textarea>
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
