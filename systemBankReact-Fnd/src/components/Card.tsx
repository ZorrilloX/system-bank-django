import { Card as BootstrapCard } from "react-bootstrap";

type CardProps = {
    title: string;
    children: React.ReactNode;
    className?: string;
};

export const Card = ({ title, children, className }: CardProps) => {
    return (
        <BootstrapCard className={`my-3 ${className}`}>
            <BootstrapCard.Header>{title}</BootstrapCard.Header>
            <BootstrapCard.Body>{children}</BootstrapCard.Body>
        </BootstrapCard>
    );
};
