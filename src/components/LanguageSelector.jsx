import {
    Button,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Text,
  } from "@chakra-ui/react";
  import { LANGUAGE_VERSIONS } from "../constants";
  import PropTypes from 'prop-types';
  
  const languages = Object.entries(LANGUAGE_VERSIONS);
  const ACTIVE_COLOR = "blue.400";
  
  const LanguageSelector = ({ language, onSelect }) => {
    return (
        <div>
            <div>
                <Menu isLazy>
                <MenuButton  className="my-1 " as={Button}>{language}</MenuButton>
                <MenuList bg={'gray.900'}>
                    {languages.map(([lang, version]) => (
                    <MenuItem
                        key={lang}
                        color={lang === language ? ACTIVE_COLOR : ""}
                        bg={lang === language ? "gray.900" : "transparent"}
                        _hover={{
                        color: ACTIVE_COLOR,
                        bg: "gray.900",
                        }}
                        onClick={() => onSelect(lang)}
                    >
                        {lang}
                        &nbsp;
                        <Text as="span" color="gray.600" fontSize="sm">
                        ({version})
                        </Text>
                    </MenuItem>
                    ))}
                </MenuList>
                </Menu>
            </div>
        </div>
    );
  };
  LanguageSelector.propTypes = {
    language: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired
  }
  export default LanguageSelector;