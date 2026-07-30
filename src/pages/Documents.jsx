import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FileText, FolderLock } from "lucide-react";
import { fetchDocuments } from "../features/documents/documentsSlice";
import PageHeader from "../components/ui/PageHeader";
import Spinner from "../components/ui/Spinner";
import Badge from "../components/ui/Badge";

export default function Documents() {
  const dispatch = useDispatch();
  const { list, status } = useSelector((s) => s.documents);

  useEffect(() => {
    dispatch(fetchDocuments());
  }, [dispatch]);

  if (status === "loading" || !list.length) return <Spinner full label="Loading documents..." />;

  return (
    <div>
      <PageHeader title="Documents Vault" subtitle="All employee documents uploaded via the mobile app, in one secure store." />

      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
          <FolderLock size={17} className="text-navy-700" />
          <h3 className="font-display font-bold text-slate-800">{list.length} Documents</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="table-th">Document</th>
                <th className="table-th">Employee</th>
                <th className="table-th">Type</th>
                <th className="table-th">Uploaded</th>
                <th className="table-th">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {list.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/70">
                  <td className="table-td">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center shrink-0">
                        <FileText size={16} />
                      </div>
                      <span className="font-semibold text-slate-700">{d.name}</span>
                    </div>
                  </td>
                  <td className="table-td text-slate-500">{d.employee}</td>
                  <td className="table-td text-slate-500">{d.type}</td>
                  <td className="table-td text-slate-500">{d.uploadedOn}</td>
                  <td className="table-td"><Badge>{d.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
