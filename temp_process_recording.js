
// This new function centralizes the logic that was previously in onstop and stopRecording
function processRecording() {
    console.log('processRecording called');
    
    const prospectId = currentRecordProspectId;
    
    if (!prospectId) {
        console.error('No prospect ID available in processRecording!');
        showToast('Erreur: ID du prospect perdu', 'error');
        hideRecordModal();
        return;
    }
    
    if (audioChunks.length === 0) {
        console.error('No audio chunks recorded!');
        showToast('Erreur: Aucune donnée audio enregistrée', 'error');
        hideRecordModal();
        return;
    }
    
    const audioBlob = new Blob(audioChunks, { type: mediaRecorder.mimeType });
    const audioUrl = URL.createObjectURL(audioBlob);
    
    console.log('Audio blob size:', audioBlob.size, 'bytes');
    
    const duration = Math.floor((Date.now() - recordStartTime) / 1000);
    const durationFormatted = `${Math.floor(duration / 60).toString().padStart(2, '0')}:${(duration % 60).toString().padStart(2, '0')}`;
    
    const recordingId = `recording_${Date.now()}_${prospectId}`;
    const recordingData = {
        id: recordingId,
        prospectId: prospectId,
        blob: audioBlob,
        url: audioUrl,
        mimeType: mediaRecorder.mimeType,
        startTime: new Date(recordStartTime).toISOString(),
        duration: duration,
        durationFormatted: durationFormatted,
        timestamp: Date.now()
    };
    
    const reader = new FileReader();
    reader.onloadend = () => {
        const base64data = reader.result;
        const storageData = { ...recordingData, blob: null, base64: base64data };
        localStorage.setItem(recordingId, JSON.stringify(storageData));
        
        const prospectRecordings = JSON.parse(localStorage.getItem(`prospect_${prospectId}_recordings`) || '[]');
        prospectRecordings.push(recordingId);
        localStorage.setItem(`prospect_${prospectId}_recordings`, JSON.stringify(prospectRecordings));
        
        console.log('Recording saved, opening depot modal...');
        hideRecordModal();
        openDepotWithRecording(prospectId, { ...recordingData, base64: base64data });
        currentRecordProspectId = null;
    };
    reader.readAsDataURL(audioBlob);
}
