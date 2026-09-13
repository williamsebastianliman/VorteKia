import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import toast, { Toaster } from "react-hot-toast";
import CEONavigationBar from "../../components/CEONavigationBar";

type StoreRemovalProposal = {
  proposal_id: number;
  store_id: string;
  removal_description: string;
  file_link: string;
};

function ViewStoreRemovalCEO() {
  const [proposals, setProposals] = useState<StoreRemovalProposal[]>([]);

  async function fetchProposals() {
    try {
      const data: StoreRemovalProposal[] = await invoke(
        "get_all_store_removal_proposals"
      );
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

  async function handleAccept(proposal: StoreRemovalProposal) {
    try {
      await invoke("delete_store_by_id", { id: proposal.store_id });
      await invoke("delete_store_removal_proposal_by_id", {
        id: proposal.proposal_id,
      });
      toast.success("Store removed and proposal deleted!");
      fetchProposals();
    } catch (err) {
      toast.error(err as string);
    }
  }

  async function handleReject(proposal: StoreRemovalProposal) {
    try {
      await invoke("delete_store_removal_proposal_by_id", {
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
        <h1 className="text-3xl font-bold mb-6">Store Removal Proposals</h1>
        <div className="grid grid-cols-3 gap-6">
          {proposals.map((proposal) => (
            <div
              key={proposal.proposal_id}
              className="bg-white shadow-md rounded-lg p-4"
            >
              <p className="font-semibold">Store ID: {proposal.store_id}</p>
              <p className="mt-2 text-gray-700">
                {proposal.removal_description}
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

export default ViewStoreRemovalCEO;
