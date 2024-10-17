import { useState } from "react";
import { Box, Button, Text, useToast } from "@chakra-ui/react";
import { executeCode } from "../api";
import PropTypes from 'prop-types'
import { motion } from "framer-motion";

const Output = ({ editorRef, language }) => {
  const toast = useToast();
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const runCode = async () => {
    console.log("editorRef")
    console.log(editorRef)
    console.log("editorRef")
    const sourceCode = editorRef.getValue();
    console.log(sourceCode)
    if (!sourceCode) return;
    try {
      setIsLoading(true);
      const { run: result } = await executeCode(language, sourceCode);
      setOutput(result.output.split("\n"));
      result.stderr ? setIsError(true) : setIsError(false);
    } catch (error) {
      console.log(error);
      toast({
        title: "An error occurred.",
        description: error.message || "Unable to run code",
        status: "error",
        duration: 6000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
   <motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
   >
        <Box w="100%">
            <Button
                className="my-1"
                variant="outline"
                bg={"green"}
                colorScheme="green"
                isLoading={isLoading}
                onClick={runCode}
                textColor={"black"}
            >
                Run Code
            </Button>
            <Box
                height="28vh"
                p={2}
                color={isError ? "red.400" : ""}
                border="2px solid"
                borderRadius={4}
                className="overflow-y-auto"
                borderColor={isError ? "red.500" : "green"}
            >
                {output
                ? output.map((line, i) => <Text key={i}>{line}</Text>)
                : 'Click "Run Code" to see the output here'}
            </Box>
        </Box>
   </motion.div>
  );
};

Output.propTypes = {
  editorRef: PropTypes.shape({
    getValue: PropTypes.func.isRequired,
  }).isRequired,
  language: PropTypes.string.isRequired,
};

export default Output;