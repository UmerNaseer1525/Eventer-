# Eventer Frontend

This is the Vite React frontend for Eventer.

## Vercel Deployment

Deploy the `frontend/` folder as one Vercel project and the `backend/` folder as a second Vercel project.

Set this environment variable in the frontend project when the backend is on a different domain:

- `VITE_API_BASE_URL=https://your-backend-project.vercel.app`

If the frontend and backend share the same origin, you can leave `VITE_API_BASE_URL` unset and the app will use relative `/api` URLs.

The frontend includes a Vercel SPA rewrite in `vercel.json` so React Router routes continue to work on refresh.

## Local Development

Install dependencies and start the app with `npm run dev` inside `frontend/`.

## Notes

The backend currently stores uploaded files on local disk. That works for local development, but Vercel’s filesystem is ephemeral, so persistent uploads will need external storage if you want them to survive redeploys.
