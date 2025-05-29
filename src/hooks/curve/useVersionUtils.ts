
export const useVersionUtils = () => {
  // Convert number back to semantic version
  const numberToSemantic = (versionNumber: number): string => {
    const major = Math.floor(versionNumber / 1000000);
    const minor = Math.floor((versionNumber % 1000000) / 10000);
    const patch = Math.floor((versionNumber % 10000) / 100);
    const subPatch = versionNumber % 100;
    
    if (subPatch > 0) {
      return `${major}.${minor}.${patch}.${subPatch}`;
    } else if (patch > 0) {
      return `${major}.${minor}.${patch}`;
    }
    return `${major}.${minor}`;
  };

  // Generate semantic version number with better logic
  const getNextVersionNumber = (existingVersions: any[], isNewVersion: boolean, currentVersionId?: string) => {
    console.log('Generating next version number:', { existingVersions, isNewVersion, currentVersionId });
    
    if (existingVersions.length === 0) return "1.0";
    
    // Find current version or latest version
    const currentVersion = currentVersionId 
      ? existingVersions.find(v => v.id === currentVersionId)
      : existingVersions.find(v => v.is_current) || existingVersions[existingVersions.length - 1];
    
    if (!currentVersion) return "1.0";
    
    const currentSemantic = numberToSemantic(currentVersion.version_number);
    console.log('Current semantic version:', currentSemantic);
    
    if (isNewVersion) {
      // Create new major version
      const majorVersions = existingVersions.map(v => Math.floor(v.version_number / 1000000));
      const maxMajor = Math.max(...majorVersions);
      const nextVersion = `${maxMajor + 1}.0`;
      console.log('Next major version:', nextVersion);
      return nextVersion;
    } else {
      // Create minor version increment
      const [major, minor = "0"] = currentSemantic.split('.');
      const nextVersion = `${major}.${parseInt(minor) + 1}`;
      console.log('Next minor version:', nextVersion);
      return nextVersion;
    }
  };

  return {
    numberToSemantic,
    getNextVersionNumber,
  };
};
