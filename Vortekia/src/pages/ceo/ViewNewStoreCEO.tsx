import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import toast, { Toaster } from "react-hot-toast";
import CEONavigationBar from "../../components/CEONavigationBar";

type NewStoreProposal = {
  proposal_id: number;
  store_name: string;
  store_description: string;
  store_location: string;
  store_open_time: string;
  store_close_time: string;
  file_link: string;
};

function ViewNewStoreProposalCEO() {
  const [proposals, setProposals] = useState<NewStoreProposal[]>([]);

  async function fetchProposals() {
    try {
      const data: NewStoreProposal[] = await invoke("view_all_store_proposals");
      setProposals(data);
    } catch (error) {
      toast.error(error as string);
    }
  }

  function handleDownload(filePath: string) {
    const link = document.createElement("a");
    link.href = `../../${filePath}`;
    link.download = filePath.split("/").pop() || "proposal.pdf";
    link.click();
  }

  async function handleAccept(proposal: NewStoreProposal) {
    try {
      await invoke("insert_store", {
        name: proposal.store_name,
        description: proposal.store_description,
        location: proposal.store_location,
        openTime: proposal.store_open_time,
        closeTime: proposal.store_close_time,
      });

      await invoke("delete_new_store_proposal_by_id", {
        id: proposal.proposal_id,
      });

      toast.success("Store inserted and proposal deleted!");
      fetchProposals();
    } catch (err) {
      toast.error(err as string);
    }
  }

  async function handleReject(proposal: NewStoreProposal) {
    try {
      await invoke("delete_new_store_proposal_by_id", {
        id: proposal.proposal_id,
      });
      toast.success("Proposal rejected and deleted.");
      fetchProposals();
    } catch (err) {
      toast.error(err as string);
    }
  }

  useEffect(() => {
    fetchProposals();
  }, []);

  return (
    <div>
      <Toaster />
      <CEONavigationBar />
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">New Store Proposals</h1>
        <div className="grid grid-cols-3 gap-6">
          {proposals.map((proposal) => (
            <div
              key={proposal.proposal_id}
              className="bg-white shadow-md rounded-lg p-4"
            >
              <h2 className="font-bold text-xl mb-1">{proposal.store_name}</h2>
              <p className="text-sm text-gray-700 mb-1">
                {proposal.store_description}
              </p>
              <p className="text-sm">Location: {proposal.store_location}</p>
              <p className="text-sm">
                Time: {proposal.store_open_time} - {proposal.store_close_time}
              </p>

              <button
                onClick={() => handleDownload(proposal.file_link)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Download Proposal
              </button>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleAccept(proposal)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleReject(proposal)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ViewNewStoreProposalCEO;
