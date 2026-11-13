import { LuSearchX } from "react-icons/lu";
import Container from "../components/ui/Container";
import Button from "../components/ui/Button";

const NotFoundPage = () => (
  <Container className="grid place-items-center py-24 text-center">
    <div className="grid max-w-md gap-4">
      <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-surface-muted text-muted-foreground">
        <LuSearchX size={30} />
      </span>
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="text-muted-foreground">The page you are looking for may have moved or no longer exists.</p>
      <div className="flex justify-center gap-3">
        <Button to="/">Go home</Button>
        <Button to="/categories" variant="secondary">Browse categories</Button>
      </div>
    </div>
  </Container>
);

export default NotFoundPage;
