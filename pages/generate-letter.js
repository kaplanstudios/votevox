import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { EditorState, convertFromRaw } from 'draft-js';
import { jsPDF } from 'jspdf';
import { stateToHTML } from 'draft-js-export-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import styles from '../styles/GenerateLetter.module.css';

const EditorComponent = dynamic(() => import('react-draft-wysiwyg').then(mod => mod.Editor), { ssr: false });

export default function GenerateLetter() {
  const [signature, setSignature] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [tone, setTone] = useState('persuasive');
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin?redirect=true');
    } else if (session) {
      fetchPreviousVoteSignature(session.user.id);
      fetchPollAndGenerateLetter();
    }
  }, [session, status, router]);

  const fetchPreviousVoteSignature = async (userId) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/get-previous-vote-signature?userId=${userId}`);
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      if (data.signatureUUID) fetchSignature(data.signatureUUID);
    } catch (error) {
      console.error('Error loading previous vote signature:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSignature = async (uuid) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/signature?uuid=${uuid}`);
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      setSignature(data.imageUrl);
    } catch (error) {
      console.error('Error loading signature:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPollAndGenerateLetter = async () => {
    try {
      setIsGenerating(true);
      const response = await fetch('/api/generate-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pollData: { title: 'Poll Title', description: 'Poll Description' },
          voteData: { optionText: 'Option Text' },
          tone,
        }),
      });

      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      if (!data.letter) throw new Error('Generated letter is empty');

      setEditorState(EditorState.createWithContent(convertFromRaw({
        entityMap: {},
        blocks: [{ key: 'initial', text: data.letter, type: 'unstyled' }],
      })));
    } catch (error) {
      console.error('Error generating letter:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGeneratePDF = () => {
    const doc = new jsPDF();
    const content = stateToHTML(editorState.getCurrentContent());
    if (!content) return;
    const tempElement = document.createElement('div');
    tempElement.innerHTML = content;
    doc.html(tempElement, {
      callback: (doc) => {
        if (signature) {
          doc.addImage(signature, 'PNG', 10, doc.internal.pageSize.height - 30, 50, 30);
        }
        doc.save('generated-letter.pdf');
      },
      x: 10,
      y: 10,
    });
  };

  if (status === 'loading') return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Generate Letter</h1>
      {isLoading && <div>Loading signature...</div>}
      {isGenerating && <div>Generating letter...</div>}
      <label htmlFor="tone" className={styles.label}>Select Tone:</label>
      <select id="tone" value={tone} onChange={(e) => setTone(e.target.value)} className={styles.select}>
        <option value="persuasive">Persuasive</option>
        <option value="informative">Informative</option>
      </select>
      <EditorComponent editorState={editorState} onEditorStateChange={setEditorState} className={styles.editor} />
      <button onClick={fetchPollAndGenerateLetter} disabled={isGenerating} className={styles.button}>Generate Letter</button>
      <button onClick={handleGeneratePDF} disabled={isGenerating} className={styles.button}>Generate PDF</button>
    </div>
  );
}
