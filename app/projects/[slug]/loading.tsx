// Route-level loading UI for project pages. Next.js renders this automatically
// as the Suspense fallback while the server component's Sanity fetch resolves
// during navigation to /projects/[slug].
import LoadingSticker from "@/components/LoadingSticker";


export default function ProjectLoading() {
	return <LoadingSticker />;
}
