import { useState, useMemo } from "react";
import { ArrowUpDown, Copy, Download } from "lucide-react";

const initialData = [
  { id: 1, name: "Rahim", passport: "A1234567", date: "2026-04-01", agent: "Agent A", med: true, mofa: false, pc: false, finger: false, visa: false, manpower: false, flight: false, cancel: false },
  { id: 2, name: "Karim", passport: "B7654321", date: "2026-03-15", agent: "Agent B", med: true, mofa: true, pc: false, finger: false, visa: false, manpower: false, flight: false, cancel: false },
  { id: 3, name: "Hasan", passport: "C1122334", date: "2026-02-20", agent: "Agent A", med: true, mofa: true, pc: true, finger: true, visa: false, manpower: false, flight: false, cancel: false },
  { id: 4, name: "Jamal", passport: "D9988776", date: "2026-01-10", agent: "Agent C", med: true, mofa: true, pc: true, finger: true, visa: true, manpower: false, flight: false, cancel: false },
  { id: 5, name: "Kamal", passport: "E5566778", date: "2026-04-02", agent: "Agent B", med: false, mofa: false, pc: false, finger: false, visa: false, manpower: false, flight: false, cancel: false },
  { id: 6, name: "Sohag", passport: "F2233445", date: "2026-03-28", agent: "Agent A", med: true, mofa: true, pc: true, finger: true, visa: true, manpower: true, flight: false, cancel: false },
  { id: 7, name: "Rana", passport: "G6677889", date: "2026-02-05", agent: "Agent C", med: true, mofa: false, pc: false, finger: false, visa: false, manpower: false, flight: false, cancel: false },
  { id: 8, name: "Babul", passport: "H4455667", date: "2026-01-25", agent: "Agent B", med: true, mofa: true, pc: true, finger: true, visa: true, manpower: true, flight: true, cancel: false },
  { id: 9, name: "Nayeem", passport: "I7788990", date: "2026-03-01", agent: "Agent A", med: false, mofa: false, pc: false, finger: false, visa: false, manpower: false, flight: false, cancel: true },
  { id: 10, name: "Shanto", passport: "J8899001", date: "2026-02-18", agent: "Agent C", med: true, mofa: true, pc: false, finger: false, visa: false, manpower: false, flight: false, cancel: false },
  { id: 11, name: "Tanvir", passport: "K3344556", date: "2026-04-01", agent: "Agent B", med: true, mofa: true, pc: true, finger: false, visa: false, manpower: false, flight: false, cancel: false },
  { id: 12, name: "Imran", passport: "L9988223", date: "2026-03-12", agent: "Agent A", med: true, mofa: true, pc: true, finger: true, visa: true, manpower: false, flight: false, cancel: false },
  { id: 13, name: "Riyad", passport: "M7766554", date: "2026-02-09", agent: "Agent C", med: false, mofa: false, pc: false, finger: false, visa: false, manpower: false, flight: false, cancel: false },
  { id: 14, name: "Arif", passport: "N2211334", date: "2026-01-30", agent: "Agent B", med: true, mofa: true, pc: true, finger: true, visa: true, manpower: true, flight: false, cancel: false },
  { id: 15, name: "Sakib", passport: "O5544332", date: "2026-04-02", agent: "Agent A", med: false, mofa: false, pc: false, finger: false, visa: false, manpower: false, flight: false, cancel: false }
];

const statusFields = ["med","mofa","pc","finger","visa","manpower","flight"];

export default function App() {
  const [data, setData] = useState(initialData);
  const [agents, setAgents] = useState(["Agent A","Agent B","Agent C"]);

  const [form, setForm] = useState({ name: "", passport: "", date: "", agent: "" });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [showAgentModal, setShowAgentModal] = useState(false);
  const [newAgent, setNewAgent] = useState("");

  const [search, setSearch] = useState("");
  const [filterAgent, setFilterAgent] = useState("");
  const [filterStage, setFilterStage] = useState("");
  const [filterMonth, setFilterMonth] = useState("");

  const [sortKey, setSortKey] = useState("");
  const [sortAsc, setSortAsc] = useState(true);

  const [page, setPage] = useState(1);
  const pageSize = 5;

  const resetFilters = () => {
    setSearch("");
    setFilterAgent("");
    setFilterStage("");
    setFilterMonth("");
    setPage(1);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = () => {
    if (!form.name || !form.passport) return;
    setData([...data, {
      id: Date.now(),
      ...form,
      med:false,mofa:false,pc:false,finger:false,visa:false,manpower:false,flight:false,cancel:false
    }]);
    closeModal();
  };

  const handleEdit = (item) => {
    setForm(item);
    setEditingId(item.id);
    setShowModal(true);
  };

  const handleUpdate = () => {
    setData(data.map(i => i.id === editingId ? { ...i, ...form } : i));
    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm({ name: "", passport: "", date: "", agent: "" });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure?") && window.confirm("Final confirm delete?")) {
      setData(data.filter(i => i.id !== id));
      closeModal();
    }
  };

  const toggleStatus = (id, field) => {
    setData(data.map(i => i.id === id ? { ...i, [field]: !i[field] } : i));
  };

  const handleSort = (key) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  };

  const copyPassport = (text) => navigator.clipboard.writeText(text);

  const downloadRow = (item) => {
    const blob = new Blob([JSON.stringify(item, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${item.name}.json`;
    a.click();
  };

  const addAgent = () => {
    if (!newAgent) return;
    setAgents([...agents, newAgent]);
    setNewAgent("");
    setShowAgentModal(false);
  };

  const stats = useMemo(() => {
    const total = data.length;
    const complete = data.filter(d => statusFields.every(f => d[f])).length;
    const pending = total - complete;
    const cancel = data.filter(d => d.cancel).length;
    return { total, complete, pending, cancel };
  }, [data]);

  const filteredData = useMemo(() => {
    let result = [...data];

    if (search) {
      result = result.filter(d =>
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.passport.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filterAgent) result = result.filter(d => d.agent === filterAgent);
    if (filterStage) result = result.filter(d => d[filterStage]);
    if (filterMonth) result = result.filter(d => d.date.startsWith(filterMonth));

    if (sortKey) {
      result.sort((a,b)=>{
        if(a[sortKey] < b[sortKey]) return sortAsc ? -1 : 1;
        if(a[sortKey] > b[sortKey]) return sortAsc ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, search, filterAgent, filterStage, filterMonth, sortKey, sortAsc]);

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen flex flex-col">
      <div className="max-w-7xl mx-auto w-full flex flex-col flex-1">

        {/* MINI DASHBOARD */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <MiniCard title="Total" value={stats.total} />
          <MiniCard title="Pending" value={stats.pending} />
          <MiniCard title="Complete" value={stats.complete} />
          <MiniCard title="Cancel" value={stats.cancel} />
        </div>

        {/* FILTER */}
        <div className="bg-white p-3 rounded-2xl shadow mb-4 flex flex-col md:flex-row gap-3 md:justify-between">
          <div className="flex flex-wrap gap-2 items-center">
            <select className="border p-2 rounded" value={filterStage} onChange={e=>setFilterStage(e.target.value)}>
              <option value="">Stage</option>
              {statusFields.map(s=> <option key={s} value={s}>{s}</option>)}
            </select>

            <select className="border p-2 rounded" value={filterAgent} onChange={e=>setFilterAgent(e.target.value)}>
              <option value="">Agent</option>
              {agents.map(a=> <option key={a}>{a}</option>)}
            </select>

            <input type="month" className="border p-2 rounded" value={filterMonth} onChange={e=>setFilterMonth(e.target.value)} />

            <button onClick={resetFilters} className="border px-3 py-2 rounded text-sm">Reset</button>
          </div>

          <div className="flex gap-2">
            <input className="border p-2 rounded" placeholder="Search..." value={search} onChange={(e)=>setSearch(e.target.value)} />
            <button onClick={()=>setShowModal(true)} className="bg-green-600 text-white px-4 py-2 rounded">+ Candidate</button>
            <button onClick={()=>setShowAgentModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded">+ Agent</button>
          </div>
        </div>

        {/* TABLE CONTAINER FIXED */}
        <div className="bg-white rounded-2xl shadow flex-1 overflow-hidden">
          <div className="h-full overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-200 sticky top-0 z-10">
                <tr>
                  {[{key:"id",label:"SL"},{key:"name",label:"Name"},{key:"passport",label:"Passport"},{key:"date",label:"Date"},{key:"agent",label:"Agent"}].map(col=>(
                    <th key={col.key} onClick={()=>handleSort(col.key)} className="p-3 cursor-pointer">
                      <div className="flex items-center gap-1">{col.label}<ArrowUpDown size={14}/></div>
                    </th>
                  ))}
                  {statusFields.map(s=> <th key={s} className="p-3">{s}</th>)}
                  <th className="p-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {paginatedData.map((item,index)=>(
                  <tr key={item.id} className="border-t">
                    <td className="p-3">{(page-1)*pageSize + index + 1}</td>
                    <td className="p-3">{item.name}</td>
                    <td className="p-3 flex items-center gap-2">{item.passport}<Copy size={14} className="cursor-pointer" onClick={()=>copyPassport(item.passport)} /></td>
                    <td className="p-3">{item.date}</td>
                    <td className="p-3">{item.agent}</td>

                    {statusFields.map(field=> (
                      <td key={field} onClick={()=>toggleStatus(item.id,field)} className="p-3 text-center cursor-pointer">
                        {item[field] ? "✔" : "✖"}
                      </td>
                    ))}

                    <td className="p-3 space-x-2">
                      <button onClick={()=>handleEdit(item)} className="bg-yellow-400 px-2 py-1 rounded">Edit</button>
                      <button onClick={()=>downloadRow(item)} className="bg-gray-300 px-2 py-1 rounded"><Download size={14}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FIXED PAGINATION */}
        <div className="flex justify-end items-center gap-2 mt-2">
          <button disabled={page===1} onClick={()=>setPage(p=>p-1)} className="px-3 py-1 border rounded">Prev</button>
          <span className="text-sm">{page}/{totalPages || 1}</span>
          <button disabled={page===totalPages} onClick={()=>setPage(p=>p+1)} className="px-3 py-1 border rounded">Next</button>
        </div>

        {/* MODALS same as before */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl w-full max-w-md">
              <h2 className="font-bold mb-3">{editingId?"Edit":"Add"} Candidate</h2>
              <input className="border p-2 w-full mb-2" name="name" value={form.name} onChange={handleChange}/>
              <input className="border p-2 w-full mb-2" name="passport" value={form.passport} onChange={handleChange}/>
              <input className="border p-2 w-full mb-2" type="date" name="date" value={form.date} onChange={handleChange}/>
              <select className="border p-2 w-full mb-2" name="agent" value={form.agent} onChange={handleChange}>
                {agents.map(a=> <option key={a}>{a}</option>)}
              </select>

              <div className="flex justify-between mt-3">
                {editingId && (
                  <button onClick={()=>handleDelete(editingId)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                )}
                <div className="ml-auto space-x-2">
                  <button onClick={closeModal} className="border px-3 py-1">Cancel</button>
                  <button onClick={editingId?handleUpdate:handleAdd} className="bg-green-600 text-white px-3 py-1 rounded">Save</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showAgentModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl w-full max-w-sm">
              <h2 className="font-bold mb-3">Add Agent</h2>
              <input className="border p-2 w-full mb-3" value={newAgent} onChange={e=>setNewAgent(e.target.value)} />
              <div className="flex justify-end gap-2">
                <button onClick={()=>setShowAgentModal(false)} className="border px-3 py-1">Cancel</button>
                <button onClick={addAgent} className="bg-blue-600 text-white px-3 py-1 rounded">Add</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function MiniCard({ title, value }) {
  return (
    <div className="bg-white px-3 py-2 rounded-xl shadow text-center">
      <p className="text-xs text-gray-500">{title}</p>
      <h2 className="text-lg font-semibold">{value}</h2>
    </div>
  );
}
