import Layout from '../../components/layout';
import ProspectsSection from '../../components/ProspectsSection';
import ProtectedRoute from '@/components/ProtectedRoute'
export default function ProspectosPage() {
  return (
    <ProtectedRoute>
    <Layout>
      <ProspectsSection />
    </Layout>
    </ProtectedRoute>
  );
}
