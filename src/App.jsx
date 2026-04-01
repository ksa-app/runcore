import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, Plane, FileX, PlaneTakeoff } from "lucide-react";

// dummy data
const generateData = () =>
  Array.from({ length: 25 }, (_, i) => ({
    id: `CND-${i + 1}`,
    name: `Candidate ${i + 1}`,
    agent: `Agent ${i % 3}`,
    stage: ["Medical", "MOFA", "Visa"][i % 3],
    country: ["Malaysia", "Saudi", "Qatar"][i % 3],
  }));

const stages = ["All", "Medical", "MOFA", "Visa"];

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [data, setData] = useState(generateData());
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [sortKey, setSortKey] = useState("id");
  const [asc, setAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const [form, setForm] = useState({ id: "", name: "", agent: "" });

  const itemsPerPage = 5;

  const filtered = useMemo(() => {
    return data
      .filter((d) =>
        (d.name.toLowerCase().includes(search.toLowerCase()) ||
          d.id.toLowerCase().includes(search.toLowerCase())) &&
        (filter === "All" || d.stage === filter)
      )
      .sort((a, b) => {
        if (a[sortKey] < b[sortKey]) return asc ? -1 : 1;
        if (a[sortKey] > b[sortKey]) return asc ? 1 : -1;
        return 0;
      });
  }, [data, search, filter, sortKey, asc]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (key) => {
    if (key === sortKey) {
      setAsc(!asc);
    } else {
      setSortKey(key);
      setAsc(true);
    }
  };

  const addCandidate = () => {
    if (!form.id || !form.name) return;
    setData([{ ...form, stage: "Medical", country: "Malaysia" }, ...data]);
    setForm({ id: "", name: "", agent: "" });
    setShowModal(false);
  };

  const Dashboard = () => {
    const total = data.length;
    const medical = data.filter((d) => d.stage === "Medical").length;
    const mofa = data.filter((d) => d.stage === "MOFA").length;
    const visa = data.filter((d) => d.stage === "Visa").length;

    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[{ label: "Total", value: total }, { label: "Medical", value: medical }, { label: "MOFA", value: mofa }, { label: "Visa", value: visa }].map((item) => (
            <Card key={item.label}>
              <CardContent className="p-4">
                <p className="text-sm text-gray-500">{item.label}</p>
                <h2 className="text-2xl font-bold">{item.value}</h2>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardContent className="p-4">
            <h2 className="font-semibold mb-3">Recent Candidates</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2">ID</th>
                  <th>Name</th>
                  <th>Stage</th>
                </tr>
              </thead>
              <tbody>
                {data.slice(0, 5).map((d, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-2">{d.id}</td>
                    <td>{d.name}</td>
                    <td>{d.stage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    );
  };

  const Table = () => (
    <Card>
      <CardContent className="p-4">
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              {["id", "name", "agent", "stage", "country"].map((key) => (
                <th key={key} className="p-2 cursor-pointer" onClick={() => handleSort(key)}>
                  {key.toUpperCase()} {sortKey === key ? (asc ? "↑" : "↓") : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((d, i) => (
              <tr key={i} className="border-t hover:bg-gray-50">
                <td className="p-2">{d.id}</td>
                <td>{d.name}</td>
                <td>{d.agent}</td>
                <td>{d.stage}</td>
                <td>{d.country}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between mt-4 items-center">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
            Prev
          </button>
          <span>{currentPage} / {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
            Next
          </button>
        </div>
      </CardContent>
    </Card>
  );

  const PageLayout = ({ title }) => (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{title}</h1>
        <Button onClick={() => setShowModal(true)}>+ Add</Button>
      </div>

      <div className="flex justify-between gap-4">
        <select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="border p-2"
        >
          {stages.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        <Input
          placeholder="Search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      <Table />
    </div>
  );

  const Sidebar = () => (
    <div className="w-60 h-screen bg-black text-white p-4 space-y-3">
      {["dashboard", "candidates", "visa", "flight", "cancel"].map((p) => (
        <button
          key={p}
          onClick={() => setPage(p)}
          className={`block w-full text-left p-2 rounded ${page === p ? "bg-gray-700" : ""}`}
        >
          {p.toUpperCase()}
        </button>
      ))}
    </div>
  );

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-gray-50 min-h-screen">
        {page === "dashboard" && <Dashboard />}
        {page === "candidates" && <PageLayout title="Candidates" />}
        {page === "visa" && <PageLayout title="Visa" />}
        {page === "flight" && <PageLayout title="Flight" />}
        {page === "cancel" && <PageLayout title="Back/Cancel" />}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl space-y-3 w-80">
            <h2 className="text-lg font-bold">Add Candidate</h2>
            <Input placeholder="ID" value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} />
            <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input placeholder="Agent" value={form.agent} onChange={(e) => setForm({ ...form, agent: e.target.value })} />
            <Button onClick={addCandidate}>Save</Button>
          </div>
        </div>
      )}
    </div>
  );
}
