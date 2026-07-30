import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrgChart } from "../features/orgchart/orgChartSlice";
import PageHeader from "../components/ui/PageHeader";
import Spinner from "../components/ui/Spinner";
import Avatar from "../components/ui/Avatar";
import { Users } from "lucide-react";

function NodeCard({ person, highlight }) {
  return (
    <div className={`card p-4 flex items-center gap-3 min-w-[220px] ${highlight ? "ring-2 ring-brand-400" : ""}`}>
      <Avatar src={person.avatar} name={person.name} size={44} />
      <div className="min-w-0">
        <p className="font-semibold text-slate-700 text-sm truncate">{person.name}</p>
        <p className="text-xs text-slate-400 truncate">{person.title}</p>
        {person.team && <p className="text-[11px] text-brand-600 font-semibold mt-0.5">{person.team}</p>}
      </div>
    </div>
  );
}

export default function OrgChart() {
  const dispatch = useDispatch();
  const { data, status } = useSelector((s) => s.orgChart);

  useEffect(() => {
    dispatch(fetchOrgChart());
  }, [dispatch]);

  if (status === "loading" || !data) return <Spinner full label="Loading organization chart..." />;

  return (
    <div>
      <PageHeader title="Organization Chart" subtitle="Reporting lines across engineering and peer departments." />

      <div className="card p-5 sm:p-8 overflow-x-auto">
        <div className="min-w-[700px]">
          <div className="flex flex-col items-center">
            <p className="text-xs font-semibold text-slate-400 uppercase mb-3 self-start flex items-center gap-1.5">
              <Users size={13} /> Peer departments
            </p>
            <div className="flex flex-wrap gap-4 justify-center mb-8">
              {data.peers.map((p) => (
                <NodeCard key={p.name} person={p} />
              ))}
            </div>

            <div className="h-8 w-px bg-slate-200" />
            <NodeCard person={data} highlight />
            <div className="h-8 w-px bg-slate-200" />

            <p className="text-xs font-semibold text-slate-400 uppercase mb-3 self-start flex items-center gap-1.5">
              <Users size={13} /> Direct reports
            </p>
            <div className="flex flex-wrap gap-4 justify-center relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-2/3 h-px bg-slate-200 hidden sm:block" />
              {data.children.map((c) => (
                <NodeCard key={c.name} person={c} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
