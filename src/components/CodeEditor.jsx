import LanguageSelector from "./LanguageSelector";
import Output from "./Output";
import { useEffect, useRef, useState } from 'react';
import * as monaco from 'monaco-editor';
import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import { MonacoBinding } from 'y-monaco';
import PropTypes from 'prop-types';

const CodeEditor = ({ groupId }) => {
  const [language, setLanguage] = useState("javascript");
  const [isInitialized, setIsInitialized] = useState(false);

  const onSelect = (language) => {
    setLanguage(language);
  };

  const editorRef = useRef(null);
  const monacoEditorRef = useRef(null);

  useEffect(() => {
    // Create a Yjs document
    const ydoc = new Y.Doc();

    // Connect to a WebRTC provider
    const provider = new WebrtcProvider(groupId, ydoc);

    // Create a Yjs text type
    const type = ydoc.getText('monaco');

    // Initialize the Monaco Editor
    const editor = monaco.editor.create(editorRef.current, {
      value: '',
      language,
      theme: 'vs-dark',
    });

    // Bind the Yjs text type to the Monaco Editor
    new MonacoBinding(type, editor.getModel(), new Set([editor]), provider.awareness);

    // Store the editor instance in the ref
    monacoEditorRef.current = editor;

    // Set initialized state to true
    setIsInitialized(true);

    // Clean up on unmount
    return () => {
      editor.dispose();
      provider.destroy();
      ydoc.destroy();
    };
  }, [groupId]);

  useEffect(() => {
    // Update the editor's language when the language state changes
    if (monacoEditorRef.current) {
      const model = monacoEditorRef.current.getModel();
      monaco.editor.setModelLanguage(model, language);
    }
  }, [language]);

  return (
    <div>
      <div width={'100%'}>
        <LanguageSelector language={language} onSelect={onSelect} />
        <div className="w-full border-2 rounded-lg overflow-hidden">
          <div style={{ width: '100%' }} ref={editorRef} className="h-[50vh] w-full" />
        </div>
      </div>
      {isInitialized && <Output editorRef={monacoEditorRef.current} language={language} />}
    </div>
  );
};


CodeEditor.propTypes={
  groupId: PropTypes.string.isRequired
}

export default CodeEditor;
