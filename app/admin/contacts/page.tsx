'use client';

import { useState, useEffect } from 'react';
import { Contact } from '@/types/contact';
import { Eye, Trash2, Mail, Search, RefreshCw, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'react-toastify';

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'resolved'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [sending, setSending] = useState(false);
  const itemsPerPage = 10;

  // Fetch contacts
  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/contacts');
      const data = await res.json();
      setContacts(data);
      setFilteredContacts(data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Filter contacts
  useEffect(() => {
    let result = contacts;

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((c) => c.status === statusFilter);
    }

    // Search filter
    if (searchTerm) {
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredContacts(result);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, contacts]);

  // Pagination
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedContacts = filteredContacts.slice(startIndex, startIndex + itemsPerPage);

  // Delete contact
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;

    try {
      const res = await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Contact deleted successfully');
        fetchContacts();
      } else {
        toast.error('Failed to delete contact');
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast.error('Failed to delete contact');
    }
  };

  // Update status
  const handleStatusUpdate = async (id: string, newStatus: 'pending' | 'resolved') => {
    try {
      const res = await fetch(`/api/contacts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        toast.success('Status updated successfully');
        fetchContacts();
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  // Send email
  const handleSendEmail = async () => {
    if (!selectedContact || !replyMessage.trim()) {
      toast.error('Please enter a reply message');
      return;
    }

    try {
      setSending(true);
      const res = await fetch('/api/contacts/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactId: selectedContact._id,
          replyMessage,
        }),
      });

      if (res.ok) {
        toast.success('Email sent successfully!');
        setShowEmailModal(false);
        setReplyMessage('');
        setSelectedContact(null);
        fetchContacts();
      } else {
        toast.error('Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send email');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-3xl font-bold text-cyan-400 mb-4 md:mb-0">Contact Messages</h1>
        <button
          onClick={fetchContacts}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition"
        >
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by name, email, or message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'all' | 'pending' | 'resolved')}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 rounded-lg">
          <p className="text-white text-sm">Total Contacts</p>
          <p className="text-white text-2xl font-bold">{contacts.length}</p>
        </div>
        <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 p-4 rounded-lg">
          <p className="text-white text-sm">Pending</p>
          <p className="text-white text-2xl font-bold">
            {contacts.filter((c) => c.status === 'pending').length}
          </p>
        </div>
        <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 rounded-lg">
          <p className="text-white text-sm">Resolved</p>
          <p className="text-white text-2xl font-bold">
            {contacts.filter((c) => c.status === 'resolved').length}
          </p>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading contacts...</p>
        </div>
      ) : null}
      
      {!loading && filteredContacts.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-400">No contacts found</p>
        </div>
      ) : null}
      
      {!loading && filteredContacts.length > 0 ? (
        <>
          <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-lg">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {paginatedContacts.map((contact) => (
                  <tr key={contact._id} className="hover:bg-gray-700 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{contact.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{contact.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-300 max-w-xs truncate">
                      {contact.message}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          contact.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {contact.status === 'pending' ? (
                          <Clock size={14} className="mr-1" />
                        ) : (
                          <CheckCircle size={14} className="mr-1" />
                        )}
                        {contact.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedContact(contact);
                            setShowViewModal(true);
                          }}
                          className="text-blue-400 hover:text-blue-300"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedContact(contact);
                            setShowEmailModal(true);
                          }}
                          className="text-green-400 hover:text-green-300"
                          title="Send Email"
                          disabled={contact.status === 'resolved'}
                        >
                          <Mail size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(contact._id)}
                          className="text-red-400 hover:text-red-300"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-white">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : null}
      
      {/* View Modal */}
      {showViewModal && selectedContact && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-cyan-400">Contact Details</h2>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedContact(null);
                }}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm">Name</p>
                <p className="text-white text-lg">{selectedContact.name}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Email</p>
                <p className="text-white text-lg">{selectedContact.email}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Message</p>
                <p className="text-white whitespace-pre-wrap">{selectedContact.message}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Status</p>
                <div className="mt-2">
                  <span
                    className={`px-4 py-2 inline-flex text-sm font-semibold rounded-full ${
                      selectedContact.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {selectedContact.status}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Received</p>
                <p className="text-white">
                  {new Date(selectedContact.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="flex gap-3 mt-6">
                {selectedContact.status === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        setShowViewModal(false);
                        setShowEmailModal(true);
                      }}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      <Mail size={18} className="inline mr-2" />
                      Send Email
                    </button>
                    <button
                      onClick={() => {
                        handleStatusUpdate(selectedContact._id, 'resolved');
                        setShowViewModal(false);
                      }}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Mark as Resolved
                    </button>
                  </>
                )}
                {selectedContact.status === 'resolved' && (
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedContact._id, 'pending');
                      setShowViewModal(false);
                    }}
                    className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
                  >
                    Mark as Pending
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Email Modal */}
      {showEmailModal && selectedContact && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-cyan-400">Send Email Reply</h2>
              <button
                onClick={() => {
                  setShowEmailModal(false);
                  setSelectedContact(null);
                  setReplyMessage('');
                }}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm">To: {selectedContact.email}</p>
              </div>
              <div>
                <label htmlFor="replyMessage" className="text-gray-400 text-sm block mb-2">
                  Your Reply
                </label>
                <textarea
                  id="replyMessage"
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  rows={8}
                  placeholder="Type your reply message here..."
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                ></textarea>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-400 text-sm mb-2">Original Message:</p>
                <p className="text-white whitespace-pre-wrap">{selectedContact.message}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSendEmail}
                  disabled={sending || !replyMessage.trim()}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? 'Sending...' : 'Send Email & Mark Resolved'}
                </button>
                <button
                  onClick={() => {
                    setShowEmailModal(false);
                    setReplyMessage('');
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
