import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import toast, { Toaster } from "react-hot-toast";
import COONavigationBar from "../../components/COONavigationBar";

type RideRemovalProposal = {
  proposal_id: number;
  ride_id: string;
  removal_description: string;
  proposal_file: string;
};

function ViewRideRemovalCOO() {
  const [proposals, setProposals] = useState<RideRemovalProposal[]>([]);

  async function fetchProposals() {
    try {
      const data: RideRemovalProposal[] = await invoke(
        "view_all_ride_removal_proposals"
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

  async function handleAccept(proposal: RideRemovalProposal) {
    try {
      await invoke("delete_ride_by_id", { id: proposal.ride_id });
      await invoke("delete_ride_removal_proposal_by_id", {
        id: proposal.proposal_id,
      });
      toast.success("Ride removed and proposal deleted!");
      fetchProposals();
    } catch (err) {
      toast.error(err as string);
    }
  }

  async function handleReject(proposal: RideRemovalProposal) {
    try {
      await invoke("delete_ride_removal_proposal_by_id", {
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
      <COONavigationBar />
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Ride Removal Proposals</h1>
        <div className="grid grid-cols-3 gap-6">
          {proposals.map((proposal) => (
            <div
              key={proposal.proposal_id}
              className="bg-white shadow-md rounded-lg p-4"
            >
              <p className="font-semibold">Ride ID: {proposal.ride_id}</p>
              <p className="mt-2 text-gray-700">
                {proposal.removal_description}
              </p>

              <button
                onClick={() => handleDownload(proposal.proposal_file)}
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

export default ViewRideRemovalCOO;
