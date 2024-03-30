declare global
{
    namespace NodeJS
    {
        interface ProcessEnv
        {
            ACCESS_KEY_ID: string;
            SECRET_ACCESS_KEY: string;
        }
    }
}