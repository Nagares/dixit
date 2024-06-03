const getBaseApiUrl = `http://localhost:5250`

export const getApiServerStateUrl = () => `${getBaseApiUrl}/serverstate`;
export const getApiPlayersUrl = () => `${getBaseApiUrl}/players/`;
export const getApiRestartUrl = (playerId: string) => `${getBaseApiUrl}/restart`;
export const getApiPlayerSubmitTextUrl = (playerId: string) => `${getBaseApiUrl}/players/${playerId}/actions/submit-text`;
export const getApiPlayerSubmitImageUrl = (playerId: string) => `${getBaseApiUrl}/players/${playerId}/actions/submit-image`;
export const getApiPlayerSubmitVoteUrl = (playerId: string) => `${getBaseApiUrl}/players/${playerId}/actions/submit-vote`;
export const getApiPlayerNextRoundUrl = (playerId: string) => `${getBaseApiUrl}/players/${playerId}/actions/next-round`;