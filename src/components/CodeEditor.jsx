import LanguageSelector from "./LanguageSelector";
import Output from "./Output";
import { useEffect, useRef, useState } from 'react';
import * as monaco from 'monaco-editor';
import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import { MonacoBinding } from 'y-monaco';
import PropTypes from 'prop-types';
import { motion } from "framer-motion";

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

    console.log("groupId"+groupId)
    // Connect to a WebRTC provider
    // const provider = new WebrtcProvider(groupId, ydoc);


    const provider = new WebrtcProvider(groupId, ydoc, {
      signaling: ['wss://signaling.yjs.dev'], // Default signaling server
      password: 'optional-password', // Optional password for extra security
      peerOpts: {
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' }, // Public STUN server
          ],
        },
      },
    });


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



    provider.on('synced', (isSynced) => {
      console.log('Is synced:', isSynced);  // Logs true or false based on sync status
    });
    provider.awareness.on('update', () => {
      console.log('Peers connected:', Array.from(provider.awareness.getStates().values()));
    });
    
    provider.on('connection', (status) => {
      console.log('Connection status:', status);  // Logs connection status changes
    }); 
    provider.on('status', (event) => {
      console.log('Connection status:', event.status); // Outputs: "connected" or "disconnected"
    });   


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
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }} 
        width={'100%'}
      >
        <LanguageSelector language={language} onSelect={onSelect} />
        <div className="w-full border rounded-lg border-gray-500 overflow-hidden">
          <div style={{ width: '100%' }} ref={editorRef} className="h-[49vh] w-full" />
        </div>
      </motion.div>
      {isInitialized && <Output editorRef={monacoEditorRef.current} language={language} />}
    </div>
  );
};


CodeEditor.propTypes={
  groupId: PropTypes.string.isRequired
}

export default CodeEditor;
