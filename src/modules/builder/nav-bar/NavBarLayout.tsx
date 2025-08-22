import {useCallback, useRef, useState} from 'react';
import {NavBarActions, NavBarMenu, StyledButton} from './atoms';
import {
    useDatabases,
    useFrameworks,
    useLanguages,
    useLibraries,
    usePractices,
    useTechnologies,
    useTools,
} from '@/stores/skills';

import {AVAILABLE_TEMPLATES} from '@/helpers/constants';
import DEFAULT_RESUME_JSON from '@/helpers/constants/resume-data.json';
import Image from 'next/image';
import {NavMenuItem} from './components/MenuItem';
import {PrintResume} from './components/PrintResume';
import {TemplateSelect} from './components/TemplateSelect';
import {ThemeSelect} from './components/ThemeSelect';
import {Toast} from '@/helpers/common/atoms/Toast';
import {useActivity} from '@/stores/activity';
import {useAwards} from '@/stores/awards';
import {useBasicDetails} from '@/stores/basic';
import {useEducations} from '@/stores/education';
import {useExperiences} from '@/stores/experience';
import {useVoluteeringStore} from '@/stores/volunteering';
import {Menu, MenuItem} from '@mui/material';
import {dateParser, dateParserToExport, deepMergeObjects} from "@/helpers/utils";
// @ts-ignore
import _ from 'lodash';

import education from "@/modules/builder/editor/modules/education/components/Education";

const TOTAL_TEMPLATES_AVAILABLE = Object.keys(AVAILABLE_TEMPLATES).length;

const NavBarLayout = () => {
    const [openToast, setOpenToast] = useState(false);
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const fileInputRef = useRef(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMenuAnchor(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchor(null);
    };

    const exportResumeData = useCallback(() => {
        const resumeBuilderState = {
            ...DEFAULT_RESUME_JSON,
            basics: {
                ...DEFAULT_RESUME_JSON.basics,
                ...useBasicDetails.getState().values,
            },
            work: useExperiences.getState().experiences,
            education: useEducations.getState().academics,
            awards: useAwards.getState().awards,
            volunteer: useVoluteeringStore.getState().volunteeredExps,
            skills: {
                languages: useLanguages.getState().get(),
                frameworks: useFrameworks.getState().get(),
                technologies: useTechnologies.getState().get(),
                libraries: useLibraries.getState().get(),
                databases: useDatabases.getState().get(),
                practices: usePractices.getState().get(),
                tools: useTools.getState().get(),
            },
            activities: useActivity.getState().activities,
        };

        let targetOrigin = isDev() ? 'http://localhost:5000/' : 'https://resumecopilot.ai';


        // we deep merge here to because we don't want to modify state
        //
        let updatedResumeJson = deepMergeObjects(resumeBuilderState);

        // format dates before sending them down
        //
        // @ts-ignore
        _.forEach(updatedResumeJson.education, item => {
            if (!_.isEmpty(item.endDate)) {
                item.endDate = dateParserToExport(item.endDate);
            }
            if (!_.isEmpty(item.startDate)) {
                item.startDate = dateParserToExport(item.startDate);
            }
        });
        _.forEach(updatedResumeJson.work, item => {
            if (!_.isEmpty(item.endDate)) {
                item.endDate = dateParserToExport(item.endDate);
            }
            if (!_.isEmpty(item.startDate)) {
                item.startDate = dateParserToExport(item.startDate);
            }
        });
        _.forEach(updatedResumeJson.awards, item => {
            if (!_.isEmpty(item.endDate)) {
                item.endDate = dateParserToExport(item.endDate);
            }
            if (!_.isEmpty(item.startDate)) {
                item.startDate = dateParserToExport(item.startDate);
            }
        });
        _.forEach(updatedResumeJson.volunteer, item => {
            if (!_.isEmpty(item.endDate)) {
                item.endDate = dateParserToExport(item.endDate);
            }
            if (!_.isEmpty(item.startDate)) {
                item.startDate = dateParserToExport(item.startDate);
            }
        });

        // post updated Resume with all the correct dates
        //
        window.parent.postMessage(updatedResumeJson, targetOrigin);
    }, []);


    const isDev = () => {
        if (typeof window !== 'undefined' && window.document !== undefined) {
            const localorigin = 'localhost';
            return window.location.hostname !== undefined && window.location.hostname === localorigin;
        }
        return false;
    };

    return (
        <nav
            className="h-14 w-full bg-resume-800 relative flex py-2.5 pl-2 md:pl-5 pr-1 nd:pr-4 items-center shadow-level-8dp z-20 print:hidden">
            <div className="flex-auto flex justify-between items-center xs:ml-3 md:ml-5">
                <NavBarMenu>
                    <NavMenuItem
                        caption={`Templates (${TOTAL_TEMPLATES_AVAILABLE})`}
                        popoverChildren={<TemplateSelect/>}
                    />
                    <NavMenuItem caption="Colors" popoverChildren={<ThemeSelect/>}/>
                </NavBarMenu>
                <div className="hidden md:flex">
                    <NavBarActions>
                        <StyledButton variant="text" onClick={exportResumeData}>
                            Save to Profile
                        </StyledButton>
                        <PrintResume/>
                    </NavBarActions>
                </div>
                <button
                    className="flex md:hidden text-white"
                    onClick={handleMenuOpen}
                    aria-label="Open menu"
                >
                    <Image src="/icons/more-horizontal.svg" alt="back" width={25} height={25}/>
                </button>
            </div>
            <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={handleMenuClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <MenuItem onClick={exportResumeData}>Save to Profile</MenuItem>
                <PrintResume isMenuButton/>
            </Menu>
            <Toast
                open={openToast}
                onClose={() => {
                    setOpenToast(false);
                }}
                content={'Resume data was successfully imported.'}
            />
        </nav>
    );
};

export default NavBarLayout;
