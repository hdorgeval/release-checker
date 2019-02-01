export const usage = `
Usage: release-checker [options]

Options:
    --branch, -b                Ensure that current branch is 'master' or 'release'
    --customize-sensitivedata   Customize the sensitive or useless data checker
                                This will create a .sensitivedata file that you can customize  
    --help, -h                  Show help
    --sensitivedata, -s         Ensure there is no sensitive or useless data in the npm package
    --tag, -T                   Ensure that latest git tag matches package.json version
    --test, -t                  Ensure that command 'npm test' is successfull
    --uncommited-files, -c      Ensure there are no uncommited files in the working tree
    --untracked-files, -u       Ensure there are no untracked files in the working tree
`;
