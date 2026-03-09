'use client';

import { useState, useEffect } from 'react';
import { useDashboardStore } from '@/store/dashboardStore';
import { contactsService } from '@/lib/contacts';
import type { Contact, ContactFormData } from '@/types';
import Modal from '@/components/ui/Modal';
import ContactForm from '@/components/dashboard/ContactForm';
import { formatDate, formatRut } from '@/lib/utils';
import toast from 'react-hot-toast';
import type { AxiosError } from 'axios';

export default function ContactsPage() {
  const {
    contacts,
    contactsLoaded,
    setContacts,
    invalidateContacts
  } = useDashboardStore();
  //const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(!contactsLoaded);
  const [error, setError] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | undefined>();

  // Delete confirmation
  const [deletingContact, setDeletingContact] = useState<Contact | null>(null);

  // Cargar contactos
  const loadContacts = async () => {
    try {
      setLoading(true);
      const data = await contactsService.getAll();
      setContacts(data);
      setError('');
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.response?.data?.message || 'Error al cargar contactos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Si ya están cargados en el store, usarlos
    if (contactsLoaded) {
      setLoading(false);
      return;
    }

    // Si no, cargarlos
    loadContacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contactsLoaded]);

  // Crear contacto
  const handleCreate = async (data: ContactFormData) => {
    try {
      await contactsService.create(data);
      invalidateContacts();
      await loadContacts();
      setIsModalOpen(false);

      toast.success('Contacto creado exitosamente');
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message = axiosError.response?.data?.message || 'Error al crear contacto';
      toast.error(message);
    }
  };

  // Editar contacto
  const handleEdit = async (data: ContactFormData) => {
    if (!editingContact) return;

    try {
      await contactsService.update(editingContact.id, data);
      invalidateContacts();
      await loadContacts();
      setIsModalOpen(false);
      setEditingContact(undefined);

      toast.success('Contacto actualizado exitosamente');
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message = axiosError.response?.data?.message || 'Error al actualizar contacto';
      toast.error(message);
    }
  };

  // Eliminar contacto
  const handleDelete = async (contact: Contact) => {
    try {
      await contactsService.delete(contact.id);
      invalidateContacts();
      await loadContacts();
      setDeletingContact(null);
      toast.success('Contacto eliminado exitosamente');
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message = axiosError.response?.data?.message || 'Error al eliminar contacto';
      toast.error(message);
    }
  };

  // Abrir modal para crear
  const openCreateModal = () => {
    setEditingContact(undefined);
    setIsModalOpen(true);
  };

  // Abrir modal para editar
  const openEditModal = (contact: Contact) => {
    setEditingContact(contact);
    setIsModalOpen(true);
  };



  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contactos</h1>
          <p className="text-gray-600 mt-1">Gestiona tus contactos frecuentes</p>
        </div>
        <button
          onClick={openCreateModal}
          className="btn-primary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          <svg
            className="w-5 h-5 inline-block mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Nuevo Contacto
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Lista de contactos */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : contacts.length === 0 ? (
        // Estado vacío
        <div className="card text-center py-12">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No tienes contactos guardados
          </h3>
          <p className="text-gray-600 mb-4">
            Agrega contactos frecuentes para realizar transferencias más rápido
          </p>
          <button onClick={openCreateModal} className="btn-primary cursor-pointer">
            Crear mi primer contacto
          </button>
        </div>
      ) : (
        // Lista de contactos
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {contacts.map((contact) => (
            <div key={contact.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{contact.fullName}</h3>
                  <p className="text-sm text-gray-600">{formatRut(contact.rut)}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openEditModal(contact)}
                    className="text-primary-600 hover:text-primary-700 p-2 cursor-pointer"
                    title="Editar"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => setDeletingContact(contact)}
                    className="text-red-600 hover:text-red-700 p-2 cursor-pointer"
                    title="Eliminar"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-600">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                  {contact.bankName}
                </div>
                <div className="flex items-center text-gray-600">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  {contact.accountType} / {contact.accountNumber}
                </div>
                <div className="text-gray-500 text-xs mt-2">
                  Agregado: {formatDate(contact.createdAt)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal crear/editar */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingContact(undefined);
        }}
        title={editingContact ? 'Editar Contacto' : 'Nuevo Contacto'}
      >
        <ContactForm
          contact={editingContact}
          onSubmit={editingContact ? handleEdit : handleCreate}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingContact(undefined);
          }}
        />
      </Modal>

      {/* Modal confirmación eliminar */}
      <Modal
        isOpen={!!deletingContact}
        onClose={() => setDeletingContact(null)}
        title="Eliminar Contacto"
      >
        <p className="text-gray-600 mb-6">
          ¿Estás seguro de que quieres eliminar a <strong>{deletingContact?.fullName}</strong>?
          Esta acción no se puede deshacer.
        </p>
        <div className="flex space-x-3">
          <button
            onClick={() => setDeletingContact(null)}
            className="flex-1 px-4 py-3 cursor-pointer border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => deletingContact && handleDelete(deletingContact)}
            className="flex-1 btn-danger cursor-pointer"
          >
            Eliminar
          </button>
        </div>
      </Modal>
    </div>
  );
}