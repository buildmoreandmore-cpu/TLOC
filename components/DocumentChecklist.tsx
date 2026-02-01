import React, { useState, useMemo } from 'react';
import { getTemplateRequirements, TemplateRequirement } from '../constants';
import {
  CheckCircle,
  Circle,
  AlertTriangle,
  FileText,
  Download,
  ChevronRight,
  Info,
} from 'lucide-react';

interface Props {
  templateId: string;
  onComplete: () => void;
  onCancel: () => void;
}

const DocumentChecklist: React.FC<Props> = ({ templateId, onComplete, onCancel }) => {
  const requirements = getTemplateRequirements(templateId);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const requiredItems = useMemo(() => {
    return requirements?.requirements.filter(r => r.required) || [];
  }, [requirements]);

  const optionalItems = useMemo(() => {
    return requirements?.requirements.filter(r => !r.required) || [];
  }, [requirements]);

  const allRequiredChecked = useMemo(() => {
    return requiredItems.every(item => checkedItems.has(item.id));
  }, [requiredItems, checkedItems]);

  const toggleItem = (itemId: string) => {
    setCheckedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  if (!requirements) {
    // No requirements, allow immediate proceed
    return (
      <div className="text-center py-6">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
        <p className="text-slate-700 mb-4">No additional documents required for this letter.</p>
        <button
          onClick={onComplete}
          className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
        >
          Continue to Send
        </button>
      </div>
    );
  }

  const renderRequirement = (req: TemplateRequirement, isRequired: boolean) => {
    const isChecked = checkedItems.has(req.id);

    return (
      <button
        key={req.id}
        onClick={() => toggleItem(req.id)}
        className={`w-full flex items-start gap-3 p-4 rounded-lg border-2 transition text-left ${
          isChecked
            ? 'bg-green-50 border-green-200'
            : isRequired
            ? 'bg-white border-slate-200 hover:border-slate-300'
            : 'bg-slate-50 border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className={`mt-0.5 ${isChecked ? 'text-green-600' : 'text-slate-400'}`}>
          {isChecked ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <Circle className="h-5 w-5" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className={`font-medium ${isChecked ? 'text-green-800' : 'text-slate-900'}`}>
              {req.label}
            </span>
            {isRequired && !isChecked && (
              <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full">
                Required
              </span>
            )}
            {!isRequired && (
              <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
                Optional
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1">{req.description}</p>
        </div>
      </button>
    );
  };

  return (
    <div>
      {/* Header info */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl mb-6">
        <Info className="h-5 w-5 text-blue-600 mt-0.5" />
        <div>
          <p className="font-medium text-blue-900">Documents Required</p>
          <p className="text-sm text-blue-700 mt-1">
            Please confirm you have the following documents ready to include with your letter.
          </p>
        </div>
      </div>

      {/* Notarization warning */}
      {requirements.requiresNotarization && (
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl mb-6">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
          <div>
            <p className="font-medium text-amber-900">Notarization Required</p>
            <p className="text-sm text-amber-700 mt-1">
              {requirements.notes || 'This document requires notarization before mailing.'}
            </p>
          </div>
        </div>
      )}

      {/* Required items */}
      {requiredItems.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-slate-700 mb-3">Required Documents</h4>
          <div className="space-y-2">
            {requiredItems.map(req => renderRequirement(req, true))}
          </div>
        </div>
      )}

      {/* Optional items */}
      {optionalItems.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-slate-500 mb-3">Optional Documents</h4>
          <div className="space-y-2">
            {optionalItems.map(req => renderRequirement(req, false))}
          </div>
        </div>
      )}

      {/* Template notes */}
      {requirements.notes && !requirements.requiresNotarization && (
        <p className="text-sm text-slate-500 mb-6 italic">
          Note: {requirements.notes}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-3 border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition"
        >
          Back
        </button>

        {requirements.canSendViaCloudMail ? (
          <button
            onClick={onComplete}
            disabled={!allRequiredChecked}
            className={`flex-1 px-4 py-3 rounded-lg font-bold transition flex items-center justify-center gap-2 ${
              allRequiredChecked
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <FileText className="h-4 w-4" />
            Confirm & Send
            <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 bg-slate-800 text-white rounded-lg font-bold hover:bg-slate-900 transition flex items-center justify-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download for Manual Mailing
          </button>
        )}
      </div>

      {/* Progress indicator */}
      {requiredItems.length > 0 && (
        <div className="mt-4">
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>Required items checked</span>
            <span>
              {requiredItems.filter(r => checkedItems.has(r.id)).length} / {requiredItems.length}
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full transition-all ${
                allRequiredChecked ? 'bg-green-500' : 'bg-blue-500'
              }`}
              style={{
                width: `${(requiredItems.filter(r => checkedItems.has(r.id)).length / requiredItems.length) * 100}%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentChecklist;
