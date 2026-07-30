import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Briefcase, Users, CalendarClock, UserCheck2, MapPin } from "lucide-react";
import { fetchRecruitment, moveCandidateStage } from "../features/recruitment/recruitmentSlice";
import PageHeader from "../components/ui/PageHeader";
import StatCard from "../components/ui/StatCard";
import Spinner from "../components/ui/Spinner";
import Avatar from "../components/ui/Avatar";
import Badge from "../components/ui/Badge";

const STAGES = ["Applied", "Shortlisted", "Interview", "Offered", "Rejected"];

export default function Recruitment() {
  const dispatch = useDispatch();
  const { positions, candidates, status } = useSelector((s) => s.recruitment);

  useEffect(() => {
    dispatch(fetchRecruitment());
  }, [dispatch]);

  if (status === "loading" || !positions.length) return <Spinner full label="Loading recruitment data..." />;

  const open = positions.filter((p) => p.status === "Open").length;
  const totalApplicants = positions.reduce((sum, p) => sum + p.applicants, 0);
  const inInterview = candidates.filter((c) => c.stage === "Interview").length;
  const offered = candidates.filter((c) => c.stage === "Offered").length;

  return (
    <div>
      <PageHeader title="Recruitment" subtitle="Track open roles and move candidates through the pipeline." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Briefcase} label="Open Positions" value={open} tone="brand" />
        <StatCard icon={Users} label="Total Applicants" value={totalApplicants} tone="teal" />
        <StatCard icon={CalendarClock} label="In Interview" value={inInterview} tone="amber" />
        <StatCard icon={UserCheck2} label="Offered" value={offered} tone="violet" />
      </div>

      <div className="card overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="font-display font-bold text-slate-800">Open Positions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="table-th">Role</th>
                <th className="table-th">Department</th>
                <th className="table-th">Location</th>
                <th className="table-th">Applicants</th>
                <th className="table-th">Posted</th>
                <th className="table-th">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {positions.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/70">
                  <td className="table-td font-semibold text-slate-700">{p.title}</td>
                  <td className="table-td text-slate-500">{p.department}</td>
                  <td className="table-td text-slate-500"><span className="inline-flex items-center gap-1"><MapPin size={13} />{p.location}</span></td>
                  <td className="table-td text-slate-500">{p.applicants}</td>
                  <td className="table-td text-slate-500">{p.postedOn}</td>
                  <td className="table-td"><Badge>{p.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="font-display font-bold text-slate-800">Candidate Pipeline</h3>
        </div>
        <div className="p-4 sm:p-5 space-y-3">
          {candidates.map((c) => (
            <div key={c.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-xl border border-slate-100">
              <Avatar src={c.avatar} name={c.name} size={40} />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-700">{c.name}</p>
                <p className="text-xs text-slate-400">{c.role} · {c.experience} exp · Applied {c.appliedOn}</p>
              </div>
              <select
                value={c.stage}
                onChange={(e) => dispatch(moveCandidateStage({ id: c.id, stage: e.target.value }))}
                className="input !py-2 !w-40 text-sm"
              >
                {STAGES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
