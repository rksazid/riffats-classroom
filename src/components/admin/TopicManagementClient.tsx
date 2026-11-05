'use client';

import { useState, useTransition } from 'react';
import {
  createTopicAction,
  updateTopicAction,
  deleteTopicAction,
  createSubtopicAction,
  deleteSubtopicAction,
} from '@/features/topics/actions';
import {
  Plus,
  BookOpen,
  Edit2,
  Trash2,
  Tag,
  Layers,
  HelpCircle,
  Award,
  ChevronDown,
  ChevronUp,
  X,
  Check,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface SubtopicItem {
  id: string;
  name: string;
  slug: string;
}

interface TopicWithDetails {
  id: string;
  name: string;
  slug: string;
  orderIndex: number;
  subjectId: string;
  subject: {
    id: string;
    name: string;
  };
  subtopics: SubtopicItem[];
  _count: {
    lessons: number;
    questions: number;
    quizzes: number;
    subtopics: number;
  };
}

interface SubjectItem {
  id: string;
  name: string;
}

interface TopicManagementClientProps {
  topics: TopicWithDetails[];
  subjects: SubjectItem[];
}

export default function TopicManagementClient({
  topics,
  subjects,
}: TopicManagementClientProps) {
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Modal / Accordion state
  const [showAddTopic, setShowAddTopic] = useState(false);
  const [editingTopic, setEditingTopic] = useState<TopicWithDetails | null>(null);
  const [activeSubtopicTopicId, setActiveSubtopicTopicId] = useState<string | null>(null);
  const [expandedTopicIds, setExpandedTopicIds] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedTopicIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCreateTopic = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      try {
        await createTopicAction(formData);
        setShowAddTopic(false);
        form.reset();
        setSuccessMessage('Grammar topic created successfully!');
        setTimeout(() => setSuccessMessage(null), 4000);
      } catch (err: unknown) {
        setErrorMessage(err instanceof Error ? err.message : 'Failed to create topic');
      }
    });
  };

  const handleUpdateTopic = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingTopic) return;
    setErrorMessage(null);
    setSuccessMessage(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.append('id', editingTopic.id);

    startTransition(async () => {
      try {
        await updateTopicAction(formData);
        setEditingTopic(null);
        setSuccessMessage('Topic updated successfully!');
        setTimeout(() => setSuccessMessage(null), 4000);
      } catch (err: unknown) {
        setErrorMessage(err instanceof Error ? err.message : 'Failed to update topic');
      }
    });
  };

  const handleDeleteTopic = (topic: TopicWithDetails) => {
    if (
      topic._count.lessons > 0 ||
      topic._count.questions > 0 ||
      topic._count.quizzes > 0
    ) {
      setErrorMessage(
        `Cannot delete "${topic.name}" because it is currently linked to ${topic._count.lessons} lessons, ${topic._count.questions} questions, and ${topic._count.quizzes} quizzes. Please reassign or delete those items first.`
      );
      return;
    }

    if (!confirm(`Are you sure you want to delete the topic "${topic.name}"?`)) {
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);

    startTransition(async () => {
      try {
        await deleteTopicAction(topic.id);
        setSuccessMessage(`Topic "${topic.name}" removed successfully.`);
        setTimeout(() => setSuccessMessage(null), 4000);
      } catch (err: unknown) {
        setErrorMessage(err instanceof Error ? err.message : 'Failed to delete topic');
      }
    });
  };

  const handleAddSubtopic = async (topicId: string, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.append('topicId', topicId);

    startTransition(async () => {
      try {
        await createSubtopicAction(formData);
        setActiveSubtopicTopicId(null);
        form.reset();
        setSuccessMessage('Subtopic added successfully!');
        setTimeout(() => setSuccessMessage(null), 4000);
      } catch (err: unknown) {
        setErrorMessage(err instanceof Error ? err.message : 'Failed to add subtopic');
      }
    });
  };

  const handleDeleteSubtopic = (subtopic: SubtopicItem) => {
    if (!confirm(`Remove subtopic "${subtopic.name}"?`)) {
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);

    startTransition(async () => {
      try {
        await deleteSubtopicAction(subtopic.id);
        setSuccessMessage(`Subtopic "${subtopic.name}" deleted.`);
        setTimeout(() => setSuccessMessage(null), 4000);
      } catch (err: unknown) {
        setErrorMessage(err instanceof Error ? err.message : 'Failed to delete subtopic');
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm font-semibold flex items-start gap-3 shadow-xs">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold">Action Notice</p>
            <p className="mt-0.5 leading-relaxed">{errorMessage}</p>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-red-500 hover:text-red-700 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <Check className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-500 hover:text-emerald-700 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/90 shadow-xs">
        <div>
          <h2 className="text-base sm:text-lg font-black text-slate-900">
            Current Topics & Syllabi ({topics.length})
          </h2>
          <p className="text-xs text-slate-500">
            Define grammatical topics and granular subtopics. Teachers use these to organize courses, lessons, and question banks.
          </p>
        </div>

        <button
          onClick={() => setShowAddTopic(!showAddTopic)}
          className="px-4 py-2.5 bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddTopic ? 'Close Form' : 'Add New Topic'}</span>
        </button>
      </div>

      {/* Add Topic Drawer / Form */}
      {showAddTopic && (
        <form
          onSubmit={handleCreateTopic}
          className="bg-white p-5 sm:p-7 rounded-3xl border-2 border-teal-500/40 shadow-md space-y-4 transition-all"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-600 animate-pulse" />
              <h3 className="text-sm sm:text-base font-black text-slate-900">
                Create New Academic / Grammar Topic
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setShowAddTopic(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-6">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Topic Name *
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Voice Change: Active to Passive"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-teal-600 outline-hidden font-medium"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Subject
              </label>
              <select
                name="subjectId"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-teal-600 outline-hidden bg-white font-medium"
              >
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Order Index
              </label>
              <input
                type="number"
                name="orderIndex"
                defaultValue={topics.length + 1}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-teal-600 outline-hidden font-bold"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddTopic(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-5 py-2.5 bg-teal-800 hover:bg-teal-900 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              {isPending ? 'Saving...' : 'Create Topic'}
            </button>
          </div>
        </form>
      )}

      {/* Edit Topic Modal */}
      {editingTopic && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleUpdateTopic}
            className="bg-white max-w-lg w-full p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xl space-y-5"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">
                Edit Topic: {editingTopic.name}
              </h3>
              <button
                type="button"
                onClick={() => setEditingTopic(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Topic Name *
              </label>
              <input
                type="text"
                name="name"
                required
                defaultValue={editingTopic.name}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-teal-600 outline-hidden font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Display Order Index
              </label>
              <input
                type="number"
                name="orderIndex"
                defaultValue={editingTopic.orderIndex}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-teal-600 outline-hidden font-bold"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingTopic(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="px-5 py-2.5 bg-teal-800 hover:bg-teal-900 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                {isPending ? 'Saving...' : 'Update Topic'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Topics List Cards */}
      <div className="space-y-4">
        {topics.map((topic) => {
          const isExpanded = expandedTopicIds[topic.id] ?? true;
          const hasLinkedItems =
            topic._count.lessons > 0 ||
            topic._count.questions > 0 ||
            topic._count.quizzes > 0;

          return (
            <div
              key={topic.id}
              className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/90 shadow-xs space-y-4 hover:border-slate-300 transition-all"
            >
              {/* Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 text-xs font-black flex items-center justify-center shrink-0">
                    #{topic.orderIndex}
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                    {topic.name}
                  </h3>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-pink-50 text-pink-700 tracking-wider uppercase shrink-0 whitespace-nowrap">
                    {topic.subject.name}
                  </span>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <button
                    onClick={() => setEditingTopic(topic)}
                    title="Edit Topic"
                    className="p-2 text-slate-500 hover:text-teal-800 hover:bg-teal-50 rounded-xl transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteTopic(topic)}
                    disabled={isPending}
                    title={
                      hasLinkedItems
                        ? 'Cannot delete: topic contains lessons, questions, or quizzes'
                        : 'Delete Topic'
                    }
                    className={`p-2 rounded-xl transition-colors ${
                      hasLinkedItems
                        ? 'text-slate-300 cursor-not-allowed'
                        : 'text-slate-400 hover:text-red-600 hover:bg-red-50'
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleExpand(topic.id)}
                    className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors ml-1"
                    title={isExpanded ? 'Collapse' : 'Expand'}
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Counts Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <span className="text-slate-500 font-semibold flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-teal-700" />
                    <span>Lessons</span>
                  </span>
                  <span className="font-black text-slate-900">{topic._count.lessons}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <span className="text-slate-500 font-semibold flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-pink-600" />
                    <span>Questions</span>
                  </span>
                  <span className="font-black text-slate-900">{topic._count.questions}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <span className="text-slate-500 font-semibold flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                    <span>Quizzes</span>
                  </span>
                  <span className="font-black text-slate-900">{topic._count.quizzes}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <span className="text-slate-500 font-semibold flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-sky-600" />
                    <span>Subtopics</span>
                  </span>
                  <span className="font-black text-slate-900">{topic.subtopics.length}</span>
                </div>
              </div>

              {/* Subtopics Section (Collapsible) */}
              {isExpanded && (
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-teal-700" />
                      <span>Subtopics & Focus Concepts</span>
                    </span>

                    {activeSubtopicTopicId !== topic.id && (
                      <button
                        onClick={() => setActiveSubtopicTopicId(topic.id)}
                        className="text-xs font-bold text-teal-800 hover:text-teal-900 flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Subtopic</span>
                      </button>
                    )}
                  </div>

                  {/* Inline Add Subtopic Form */}
                  {activeSubtopicTopicId === topic.id && (
                    <form
                      onSubmit={(e) => handleAddSubtopic(topic.id, e)}
                      className="p-3 bg-teal-50/60 rounded-2xl border border-teal-200 flex flex-col sm:flex-row items-center gap-2"
                    >
                      <input
                        type="text"
                        name="name"
                        required
                        autoFocus
                        placeholder="e.g. Gerund vs. Present Participle"
                        className="w-full sm:flex-1 px-3 py-1.5 bg-white rounded-xl border border-teal-300 text-xs focus:border-teal-700 outline-hidden font-medium"
                      />
                      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                        <button
                          type="submit"
                          disabled={isPending}
                          className="px-3.5 py-1.5 bg-teal-800 hover:bg-teal-900 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-2xs"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveSubtopicTopicId(null)}
                          className="px-2 py-1.5 text-xs text-slate-500 hover:text-slate-800"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Subtopics Badges */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {topic.subtopics.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">
                        No subtopics created yet. Click &quot;Add Subtopic&quot; to divide this topic into specific concepts.
                      </p>
                    ) : (
                      topic.subtopics.map((sub) => (
                        <span
                          key={sub.id}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-semibold border border-slate-200/60 transition-colors"
                        >
                          <span>{sub.name}</span>
                          <button
                            type="button"
                            onClick={() => handleDeleteSubtopic(sub)}
                            disabled={isPending}
                            title="Delete Subtopic"
                            className="text-slate-400 hover:text-red-600 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
