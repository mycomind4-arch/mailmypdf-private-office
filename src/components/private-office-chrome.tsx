import { Link } from "@tanstack/react-router";
import { BriefcaseBusiness, ChevronDown, Plus, Shield } from "lucide-react";

export function PrivateOfficeChrome() {
  return (
    <header className="office-chrome">
      <div className="office-chrome__inner">
        <Link to="/dashboard" className="office-brand" aria-label="Private Office dashboard">
          <span className="office-brand__mark"><Shield size={15} strokeWidth={1.8} /></span>
          <span>
            <span className="office-brand__name">PRIVATE OFFICE</span>
            <span className="office-brand__sub">MAILMYPDF</span>
          </span>
        </Link>

        <nav className="office-nav" aria-label="Private Office">
          <Link to="/dashboard" className="office-nav__link office-nav__link--active">
            <BriefcaseBusiness size={15} /> Matters
          </Link>
          <Link to="/workflows" className="office-nav__link">Workflows</Link>
        </nav>

        <div className="office-actions">
          <Link to="/workflows" className="office-new-matter">
            <Plus size={15} /> New matter
          </Link>
          <button className="office-account" type="button" aria-label="Account menu">
            <span className="office-account__avatar">PO</span>
            <ChevronDown size={14} />
          </button>
        </div>
      </div>
    </header>
  );
}
