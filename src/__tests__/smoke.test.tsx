import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Header from '@/components/Header';

describe('Header Component', () => {
    it('renders the logo text', () => {
        render(<Header />);
        expect(screen.getByText(/Etheleen & Alma's/i)).toBeInTheDocument();
    });

    it('contains navigation links', () => {
        render(<Header />);
        expect(screen.getByText(/Home/i)).toBeInTheDocument();
        expect(screen.getByText(/Services/i)).toBeInTheDocument();
        expect(screen.getByText(/Menu/i)).toBeInTheDocument();
    });
});
