import type {NextPage} from 'next';
import Head from 'next/head';
import BuilderLayout from '@/modules/builder/BuilderLayout';
import {useEffect} from "react";
import {useBasicDetails} from "@/stores/basic";
import {
    useDatabases,
    useFrameworks,
    useLanguages,
    useLibraries,
    usePractices,
    useTechnologies,
    useTools
} from "@/stores/skills";
import {useExperiences} from "@/stores/experience";
import {useEducations} from "@/stores/education";
import {useVoluteeringStore} from "@/stores/volunteering";
import {useAwards} from "@/stores/awards";
import {useActivity} from "@/stores/activity";

const BuilderPage: NextPage = () => {


    // Listen for messages from the iframe
    useEffect(() => {
        const handleMessage = (event: { origin: string; data: any; }) => {

            console.log("Recieved message", event);
            // **Important:** Verify the origin of the message for security

            const origins = ["http://localhost:3000",
                "http://localhost:5000"]

            if (origins.includes(event.origin)) {
                console.log('Message received from parent:', event.data);

                handleResumeChange(event.data);
            }
        };

        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, []);


    const handleResumeChange = (jsonResume: any) => {

        const {
            basics = {},
            skills = {},
            work = [],
            education = [],
            activities = {
                involvements: '',
                achievements: '',
            },
            volunteer = [],
            awards = [],
        } = jsonResume;

        const {
            languages = [],
            frameworks = [],
            libraries = [],
            databases = [],
            technologies = [],
            practices = [],
            tools = [],
        } = skills;

        useBasicDetails.getState().reset(basics);
        useLanguages.getState().reset(languages);
        useFrameworks.getState().reset(frameworks);
        useLibraries.getState().reset(libraries);
        useDatabases.getState().reset(databases);
        useTechnologies.getState().reset(technologies);
        usePractices.getState().reset(practices);
        useTools.getState().reset(tools);
        useExperiences.getState().reset(work);
        useEducations.getState().reset(education);
        useVoluteeringStore.getState().reset(volunteer);
        useAwards.getState().reset(awards);
        useActivity.getState().reset(activities);
    };

    return (
        <div>
            <Head>
                <title>Resume Builder</title>
                <meta name="description" content="Resume Builder"/>
                <link rel="icon" type="image/png" href="/icons/resume-icon.png"/>
            </Head>

            <BuilderLayout/>
        </div>
    );
};

export default BuilderPage;
