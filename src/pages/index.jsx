import Layout from "./Layout.jsx";
import Dashboard from "./Dashboard";
import Missions from "./Missions";
import Interimaires from "./Interimaires";
import Entreprises from "./Entreprises";
import Paiements from "./Paiements";
import InterimaireDetails from "./InterimaireDetails";
import EntrepriseDetails from "./EntrepriseDetails";
import FichesPaie from "./FichesPaie";
import Guide from "./Guide";
import Documents from "./Documents";
import Contrats from "./Contrats";
import Login from "./Login";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';

const PAGES = {
    Dashboard: Dashboard,
    Missions: Missions,
    Interimaires: Interimaires,
    Entreprises: Entreprises,
    Paiements: Paiements,
    InterimaireDetails: InterimaireDetails,
    EntrepriseDetails: EntrepriseDetails,
    FichesPaie: FichesPaie,
    Guide: Guide,
    Documents: Documents,
    Contrats: Contrats,
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Routes>
            {/* Route publique - Login */}
            <Route path="/login" element={<Login />} />
            
            {/* Routes protégées - Nécessitent une authentification */}
            <Route path="/" element={
                <ProtectedRoute>
                    <Layout currentPageName={currentPage}>
                        <Dashboard />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/Dashboard" element={
                <ProtectedRoute>
                    <Layout currentPageName="Dashboard">
                        <Dashboard />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/Missions" element={
                <ProtectedRoute>
                    <Layout currentPageName="Missions">
                        <Missions />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/Interimaires" element={
                <ProtectedRoute>
                    <Layout currentPageName="Interimaires">
                        <Interimaires />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/Entreprises" element={
                <ProtectedRoute>
                    <Layout currentPageName="Entreprises">
                        <Entreprises />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/Paiements" element={
                <ProtectedRoute>
                    <Layout currentPageName="Paiements">
                        <Paiements />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/InterimaireDetails" element={
                <ProtectedRoute>
                    <Layout currentPageName="InterimaireDetails">
                        <InterimaireDetails />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/EntrepriseDetails" element={
                <ProtectedRoute>
                    <Layout currentPageName="EntrepriseDetails">
                        <EntrepriseDetails />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/FichesPaie" element={
                <ProtectedRoute>
                    <Layout currentPageName="FichesPaie">
                        <FichesPaie />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/Guide" element={
                <ProtectedRoute>
                    <Layout currentPageName="Guide">
                        <Guide />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/Documents" element={
                <ProtectedRoute>
                    <Layout currentPageName="Documents">
                        <Documents />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/Contrats" element={
                <ProtectedRoute>
                    <Layout currentPageName="Contrats">
                        <Contrats />
                    </Layout>
                </ProtectedRoute>
            } />
        </Routes>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}
