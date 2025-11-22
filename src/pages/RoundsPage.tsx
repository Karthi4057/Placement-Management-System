 'use client';

import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import {
  Plus,
  Pencil,
  Trash2,
  Layers,
  Upload,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

interface Question {
  question: string;
  answer: string;
  attachment?: string;
  fileName?: string;
}

interface Round {
  id: string;
  companyId: string;
  companyName: string;
  roundName: string;
  mode: string;
  difficulty: string;
  roundAttachment?: string;
  roundFileName?: string;
  questions: Question[];
}

interface Company {
  id: string;
  name: string;
}

interface RoundSectionData {
  roundName: string;
  mode: string;
  difficulty: string;
  roundAttachment?: string;
  roundFileName?: string;
  questions: Question[];
}

interface FormData {
  companyId: string;
  currentRoundIndex: number;
  roundsData: Record<string, RoundSectionData>;
}

interface RoundFormProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  companies: Company[];
  onSubmit: (e: React.FormEvent) => void;
  onSaveCurrentAndNext: () => void;
  onPrevious: () => void;
  isEditing?: boolean;
  onCancel?: () => void;
}

/* -------------------------------------------------------------------------- */
/*                               ROUND FORM                                   */
/* -------------------------------------------------------------------------- */
const RoundForm: React.FC<RoundFormProps> = ({
  formData,
  setFormData,
  companies,
  onSubmit,
  onSaveCurrentAndNext,
  onPrevious,
  isEditing = false,
  onCancel,
}) => {
  const fileInputRefs = useRef<Record<string, Record<number, HTMLInputElement | null>>>({});
  const roundFileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const roundKeys: string[] = Array.from({ length: 10 }, (_, i) => `Round ${i + 1}`);

  if (formData.currentRoundIndex === -1) {
    return (
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="company">Select Company</Label>
          <Select
            value={formData.companyId}
            onValueChange={(v) => setFormData((p) => ({ ...p, companyId: v }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose a company" />
            </SelectTrigger>
            <SelectContent>
              {companies.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="text-center py-8">
          <Button
            type="button"
            onClick={() => setFormData((p) => ({ ...p, currentRoundIndex: 0 }))}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Start with Round 1
          </Button>
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled>
            {isEditing ? 'Update' : 'Add'} Rounds
          </Button>
          {isEditing && onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    );
  }

  const idx = formData.currentRoundIndex;
  const roundKey = roundKeys[idx];
  const data = formData.roundsData[roundKey];
  const isLast = idx === roundKeys.length - 1;

  const addQuestion = () => {
    setFormData((p) => ({
      ...p,
      roundsData: {
        ...p.roundsData,
        [roundKey]: {
          ...p.roundsData[roundKey],
          questions: [...p.roundsData[roundKey].questions, { question: '', answer: '' }],
        },
      },
    }));
  };

  const updateQuestion = (i: number, field: 'question' | 'answer', v: string) => {
    setFormData((p) => ({
      ...p,
      roundsData: {
        ...p.roundsData,
        [roundKey]: {
          ...p.roundsData[roundKey],
          questions: p.roundsData[roundKey].questions.map((q, qi) =>
            qi === i ? { ...q, [field]: v } : q
          ),
        },
      },
    }));
  };

  const updateQuestionAttachment = async (i: number, file: File | null) => {
    if (!file) {
      setFormData((p) => ({
        ...p,
        roundsData: {
          ...p.roundsData,
          [roundKey]: {
            ...p.roundsData[roundKey],
            questions: p.roundsData[roundKey].questions.map((q, qi) =>
              qi === i ? { ...q, attachment: '', fileName: '' } : q
            ),
          },
        },
      }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setFormData((p) => ({
        ...p,
        roundsData: {
          ...p.roundsData,
          [roundKey]: {
            ...p.roundsData[roundKey],
            questions: p.roundsData[roundKey].questions.map((q, qi) =>
              qi === i ? { ...q, attachment: base64, fileName: file.name } : q
            ),
          },
        },
      }));
    };
    reader.readAsDataURL(file);
  };

  const removeQuestion = (i: number) => {
    setFormData((p) => ({
      ...p,
      roundsData: {
        ...p.roundsData,
        [roundKey]: {
          ...p.roundsData[roundKey],
          questions: p.roundsData[roundKey].questions.filter((_, qi) => qi !== i),
        },
      },
    }));
  };

  const removeAttachment = (i: number) => {
    setFormData((p) => ({
      ...p,
      roundsData: {
        ...p.roundsData,
        [roundKey]: {
          ...p.roundsData[roundKey],
          questions: p.roundsData[roundKey].questions.map((q, qi) =>
            qi === i ? { ...q, attachment: '', fileName: '' } : q
          ),
        },
      },
    }));
  };

  const updateRoundAttachment = async (file: File | null) => {
    if (!file) {
      setFormData((p) => ({
        ...p,
        roundsData: {
          ...p.roundsData,
          [roundKey]: { ...p.roundsData[roundKey], roundAttachment: '', roundFileName: '' },
        },
      }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setFormData((p) => ({
        ...p,
        roundsData: {
          ...p.roundsData,
          [roundKey]: {
            ...p.roundsData[roundKey],
            roundAttachment: base64,
            roundFileName: file.name,
          },
        },
      }));
    };
    reader.readAsDataURL(file);
  };

  const removeRoundAttachment = () => {
    setFormData((p) => ({
      ...p,
      roundsData: {
        ...p.roundsData,
        [roundKey]: { ...p.roundsData[roundKey], roundAttachment: '', roundFileName: '' },
      },
    }));
  };

  const updateRoundName = (v: string) => {
    setFormData((p) => ({
      ...p,
      roundsData: {
        ...p.roundsData,
        [roundKey]: { ...p.roundsData[roundKey], roundName: v },
      },
    }));
  };
  const updateMode = (v: string) => {
    setFormData((p) => ({
      ...p,
      roundsData: {
        ...p.roundsData,
        [roundKey]: { ...p.roundsData[roundKey], mode: v },
      },
    }));
  };
  const updateDifficulty = (v: string) => {
    setFormData((p) => ({
      ...p,
      roundsData: {
        ...p.roundsData,
        [roundKey]: { ...p.roundsData[roundKey], difficulty: v },
      },
    }));
  };

  const handleChooseFile = (i: number) => fileInputRefs.current[roundKey]?.[i]?.click();
  const handleChooseRoundFile = () => roundFileInputRefs.current[roundKey]?.click();

  const setFileInputRef = (i: number) => (el: HTMLInputElement | null) => {
    if (!fileInputRefs.current[roundKey]) fileInputRefs.current[roundKey] = {};
    fileInputRefs.current[roundKey][i] = el;
  };
  const setRoundFileInputRef = (el: HTMLInputElement | null) => {
    roundFileInputRefs.current[roundKey] = el;
  };

  const validateCurrentRound = (d: RoundSectionData) => {
    if (!d.roundName.trim()) {
      toast.error('Please enter a round name');
      return false;
    }
    const complete = d.questions.filter((q) => q.question.trim() && q.answer.trim());
    if (complete.length === 0 && !d.roundAttachment) {
      toast.error('Please add at least one question or a round attachment');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentRound(data)) return;
    onSaveCurrentAndNext();
  };
  const handlePrev = () => onPrevious();

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="company">Select Company</Label>
        <Select
          value={formData.companyId}
          onValueChange={(v) => setFormData((p) => ({ ...p, companyId: v }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choose a company" />
          </SelectTrigger>
          <SelectContent>
            {companies.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg p-6 space-y-5">
        <h3 className="text-xl font-bold">Round {idx + 1}: {data.roundName || 'Untitled Round'}</h3>

        <div className="space-y-2">
          <Label>Round Name</Label>
          <Input
            value={data.roundName}
            onChange={(e) => updateRoundName(e.target.value)}
            placeholder="e.g., Aptitude Round"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Mode</Label>
            <Select value={data.mode} onValueChange={updateMode}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Online">Online</SelectItem>
                <SelectItem value="Offline">Offline</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Difficulty</Label>
            <Select value={data.difficulty} onValueChange={updateDifficulty}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Round Attachment (Optional, max 5MB)
          </Label>
          <div className="space-y-1">
            <input
              ref={setRoundFileInputRef}
              type="file"
              className="hidden"
              accept="image/*,.pdf,.doc,.docx"
              onChange={(e) => updateRoundAttachment(e.target.files?.[0] ?? null)}
            />
            <Button type="button" variant="outline" onClick={handleChooseRoundFile} className="w-full justify-start">
              <Upload className="w-4 h-4 mr-2" />
              Choose File
            </Button>
            <p className="text-sm text-muted-foreground ml-1">
              {data.roundFileName || 'No file chosen'}
            </p>
            {data.roundFileName && (
              <Button type="button" variant="ghost" size="sm" onClick={removeRoundAttachment} className="ml-1">
                <Trash2 className="w-4 h-4 text-destructive" />
                Remove
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Questions & Answers</Label>
            <Button type="button" size="sm" variant="outline" onClick={addQuestion}>
              <Plus className="w-4 h-4 mr-2" />
              Add Question
            </Button>
          </div>

          {data.questions.map((q, i) => (
            <Card key={i}>
              <CardContent className="pt-6 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm">Question {i + 1}</span>
                  {data.questions.length > 1 && (
                    <Button type="button" size="sm" variant="ghost" onClick={() => removeQuestion(i)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  )}
                </div>

                <Textarea
                  placeholder="Enter question"
                  value={q.question}
                  onChange={(e) => updateQuestion(i, 'question', e.target.value)}
                />
                <Textarea
                  placeholder="Enter answer"
                  value={q.answer}
                  onChange={(e) => updateQuestion(i, 'answer', e.target.value)}
                />

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Question Attachment (Optional, max 5MB)
                  </Label>
                  <div className="space-y-1">
                    <input
                      ref={setFileInputRef(i)}
                      type="file"
                      className="hidden"
                      accept="image/*,.pdf,.doc,.docx"
                      onChange={(e) => updateQuestionAttachment(i, e.target.files?.[0] ?? null)}
                    />
                    <Button type="button" variant="outline" onClick={() => handleChooseFile(i)} className="w-full justify-start">
                      <Upload className="w-4 h-4 mr-2" />
                      Choose File
                    </Button>
                    <p className="text-sm text-muted-foreground ml-1">
                      {q.fileName || 'No file chosen'}
                    </p>
                    {q.fileName && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeAttachment(i)} className="ml-1">
                        <Trash2 className="w-4 h-4 text-destructive" />
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {data.questions.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No questions added yet. Click “Add Question” to start.
            </p>
          )}
        </div>

        <div className="flex justify-between mt-6">
          {idx > 0 && (
            <Button type="button" variant="outline" onClick={handlePrev} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          )}
          {!isLast && (
            <Button type="button" onClick={handleNext} className="gap-2">
              Add Next Round
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
          {isLast && (
            <Button type="submit" className="gap-2">
              Finish Adding Rounds
            </Button>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="button" onClick={handleNext}>
          Save Current Round
        </Button>
        {isEditing && onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

/* -------------------------------------------------------------------------- */
/*                               MAIN PAGE                                    */
/* -------------------------------------------------------------------------- */
const RoundsPage = () => {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingRound, setEditingRound] = useState<Round | null>(null);

  const roundKeys = Array.from({ length: 10 }, (_, i) => `Round ${i + 1}`);

  const initialFormData: FormData = {
    companyId: '',
    currentRoundIndex: -1,
    roundsData: roundKeys.reduce((acc, k) => {
      acc[k] = { roundName: '', mode: 'Online', difficulty: 'Medium', questions: [] };
      return acc;
    }, {} as Record<string, RoundSectionData>),
  };
  const [formData, setFormData] = useState<FormData>(initialFormData);

  useEffect(() => {
    const r = localStorage.getItem('rounds');
    const c = localStorage.getItem('companies');
    if (r) setRounds(JSON.parse(r));
    if (c) setCompanies(JSON.parse(c));
  }, []);

  const saveRounds = (list: Round[]) => {
    localStorage.setItem('rounds', JSON.stringify(list));
    setRounds(list);
  };

  const createRoundFromData = (
    key: string,
    companyId: string,
    companyName: string
  ): Round | null => {
    const d = formData.roundsData[key];
    const complete = d.questions.filter((q) => q.question.trim() && q.answer.trim());

    if (!d.roundName.trim() || (complete.length === 0 && !d.roundAttachment)) return null;

    return {
      id: Date.now().toString(),
      companyId,
      companyName,
      roundName: d.roundName,
      mode: d.mode,
      difficulty: d.difficulty,
      roundAttachment: d.roundAttachment,
      roundFileName: d.roundFileName,
      questions: complete,
    };
  };

  const handleSaveCurrentAndNext = () => {
    const comp = companies.find((c) => c.id === formData.companyId);
    if (!comp) {
      toast.error('Please select a company');
      return;
    }
    const key = roundKeys[formData.currentRoundIndex];
    const newR = createRoundFromData(key, comp.id, comp.name);
    if (newR) {
      saveRounds([...rounds, newR]);
      const msg =
        formData.currentRoundIndex === 0
          ? 'Add first round successfully'
          : `Round ${formData.currentRoundIndex + 1} saved`;
      toast.success(msg);
    } else {
      toast.warning('Round skipped – missing required data');
    }

    if (formData.currentRoundIndex < roundKeys.length - 1) {
      setFormData((p) => ({ ...p, currentRoundIndex: p.currentRoundIndex + 1 }));
    }
  };

  const handlePrevious = () => {
    setFormData((p) => ({ ...p, currentRoundIndex: p.currentRoundIndex - 1 }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const comp = companies.find((c) => c.id === formData.companyId);
    if (!comp) {
      toast.error('Select a company first');
      return;
    }
    if (formData.currentRoundIndex === -1) return;

    const key = roundKeys[formData.currentRoundIndex];
    const newR = createRoundFromData(key, comp.id, comp.name);
    if (newR) {
      saveRounds([...rounds, newR]);
      toast.success('All rounds saved!');
    }

    setIsAddOpen(false);
    setFormData(initialFormData);
  };

  const handleEdit = (r: Round) => {
    setFormData({
      companyId: r.companyId,
      currentRoundIndex: 0,
      roundsData: roundKeys.reduce((acc, k, i) => {
        if (i === 0) {
          acc[k] = {
            roundName: r.roundName,
            mode: r.mode,
            difficulty: r.difficulty,
            roundAttachment: r.roundAttachment ?? '',
            roundFileName: r.roundFileName ?? '',
            questions: r.questions.map((q) => ({
              ...q,
              attachment: q.attachment ?? '',
              fileName: q.fileName ?? '',
            })),
          };
        } else {
          acc[k] = { roundName: '', mode: 'Online', difficulty: 'Medium', questions: [] };
        }
        return acc;
      }, {} as Record<string, RoundSectionData>),
    });
    setEditingRound(r);
    setIsAddOpen(true);
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const comp = companies.find((c) => c.id === formData.companyId);
    if (!comp || !editingRound) return;

    const key = roundKeys[0];
    const d = formData.roundsData[key];
    const complete = d.questions.filter((q) => q.question.trim() && q.answer.trim());

    const updated: Round = {
      ...editingRound,
      roundName: d.roundName,
      mode: d.mode,
      difficulty: d.difficulty,
      roundAttachment: d.roundAttachment,
      roundFileName: d.roundFileName,
      questions: complete,
    };

    saveRounds(rounds.map((r) => (r.id === editingRound.id ? updated : r)));
    toast.success('Round updated');
    setIsAddOpen(false);
    setEditingRound(null);
    setFormData(initialFormData);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this round?')) {
      saveRounds(rounds.filter((r) => r.id !== id));
      toast.success('Round deleted');
    }
  };

  const handleCancelEdit = () => {
    setEditingRound(null);
    setIsAddOpen(false);
    setFormData(initialFormData);
  };

  const renderAttachment = (src?: string, name?: string) => {
    if (!src) return null;
    if (src.startsWith('data:image/')) {
      return <img src={src} alt="attachment" className="max-w-full h-auto rounded mt-2" />;
    }
    return (
      <a href={src} download={name ?? 'file'} className="text-blue-500 underline text-sm">
        Download {name ?? 'attachment'}
      </a>
    );
  };

  const isEditing = !!editingRound;
  const onSubmit = isEditing ? handleUpdateSubmit : handleSubmit;

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Rounds & Questions</h1>
          <p className="text-muted-foreground mt-1">Manage interview rounds and questions</p>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setFormData(initialFormData)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Rounds
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Round' : 'Add New Rounds'}</DialogTitle>
            </DialogHeader>

            <RoundForm
              formData={formData}
              setFormData={setFormData}
              companies={companies}
              onSubmit={onSubmit}
              onSaveCurrentAndNext={handleSaveCurrentAndNext}
              onPrevious={handlePrevious}
              isEditing={isEditing}
              onCancel={handleCancelEdit}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* DISPLAYED ROUNDS */}
      <div className="grid gap-4">
        {rounds.map((round, index) => (
          <Card key={round.id} className="overflow-hidden">
            <div className="bg-muted/30 p-4 border-b">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Layers className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary">{round.companyName}</h3>
                  <p className="text-lg font-semibold">
                    Round {index + 1}: {round.roundName}
                  </p>
                </div>
              </div>
            </div>

            <CardContent className="pt-4">
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                <span>
                  <strong>Mode:</strong> {round.mode}
                </span>
                <span>
                  <strong>Difficulty:</strong> {round.difficulty}
                </span>
                <span>
                  <strong>Questions:</strong> {round.questions.length}
                </span>
              </div>

              {renderAttachment(round.roundAttachment, round.roundFileName)}

              <div className="mt-4 space-y-3">
                {round.questions.map((q, i) => (
                  <div key={i} className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium">Q{i + 1}: {q.question}</p>
                    <p className="text-sm text-muted-foreground mt-1">A: {q.answer}</p>
                    {renderAttachment(q.attachment, q.fileName)}
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button size="sm" variant="ghost" onClick={() => handleEdit(round)}>
                  <Pencil className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleDelete(round.id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {rounds.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Layers className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No rounds added yet</p>
            <p className="text-sm text-muted-foreground">Click “Add Rounds” to get started</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RoundsPage;