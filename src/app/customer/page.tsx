'use client';

import { useState, useRef } from 'react';

import { useFileUpload } from '@/hooks/useFileUpload';
import { useCustomerForm } from '@/hooks/useCustomerForm';
import { FileOrder } from '@/types/order';

import Hero from '@/components/customer/Hero';
import ReviewModal from '@/components/customer/ReviewModal';
import CustomerForm from '@/components/customer/CustomerForm';
import SuccessScreen from '@/components/customer/SuccessScreen';

export default function CustomerPage() {
  const formRef = useRef<HTMLDivElement>(null);

  const [showReview, setShowReview] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Snapshots for success screen
  const [submittedFiles, setSubmittedFiles] = useState<FileOrder[]>([]);
  const [submittedName, setSubmittedName] = useState('');
  const [submittedEmail, setSubmittedEmail] = useState('');

  const {
    files,
    isDragging,
    setIsDragging,
    addFiles,
    removeFile,
    setFiles,
    updateFile,
    onDrop
  } = useFileUpload();

  const {
    name, setName,
    email, setEmail,
    branch, setBranch,
    pickupDate, setPickupDate,
    isValid,
  } = useCustomerForm(files); 

  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: 'smooth' });

  const resetAll = () => {
    setName('');
    setEmail('');
    setBranch('');
    setPickupDate(undefined);
    setFiles([]);
    setIsDragging(false);
    setShowReview(false);
  };

  const handleConfirm = () => {
    setSubmittedFiles(files);
    setSubmittedName(name);
    setSubmittedEmail(email);
    setShowReview(false);
    resetAll();
    setSubmitted(true);
  };

  // ── Success screen ────────────────────────────────────
  if (submitted) {
    return (
      <SuccessScreen
        name={submittedName}
        email={submittedEmail}
        files={submittedFiles}
        onReset={() => {
          setSubmitted(false);
          resetAll();
        }}
      />
    );
  }

  // ── Main page ─────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero Section ── */}
      <Hero onScroll={scrollToForm} />

      {/* ── Customer Form Section ── */}
      <CustomerForm
        formRef={formRef}
        name={name}
        setName={setName}
        email={email}
        setEmail={setEmail}
        branch={branch}
        setBranch={setBranch}
        pickupDate={pickupDate}
        setPickupDate={setPickupDate}

        files={files}
        isDragging={isDragging}
        setIsDragging={setIsDragging}
        addFiles={addFiles}
        onDrop={onDrop}

        removeFile={removeFile}
        updateFile={updateFile}
        setShowReview={setShowReview}

        isValid={isValid}
      />

      {/* Footer */}
      <footer className="border-t border-zinc-100 py-6 text-center text-zinc-400 text-xs bg-white">
        © {new Date().getFullYear()} Connections Copier · All rights reserved
      </footer>

      {/* ── Order Review Modal ── */}
      <ReviewModal
        open={showReview}
        setOpen={setShowReview}
        files={files}
        name={name}
        email={email}
        pickupDate={pickupDate}
        onConfirm={handleConfirm}
      />

    </div>
  );
}