export const usage = `
Usage: release-checker [options]

Options:
    --branch, -b                Ensure that current branch is 'master' or 'release'
    --customize-sensitivedata   Customize the sensitive or useless data checker
                                This will create a .sensitivedata file that you can customize  
    
    --help, -h                  Show help
    --sensitivedata, -s         Ensure there is no sensitive or useless data in the npm package
    --test, -t                  Ensure that command 'npm test' is successfull
    --untracked-files, -u       Ensure there are no untracked files in the working tree
`;
